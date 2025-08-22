import Stripe from 'stripe';
import { PrismaClient, Plan } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export const PRICING_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Local stdio MCP server',
      '1 user per team',
      'Basic collaboration tools',
      'Community support'
    ],
    limits: {
      sessions: 1,
      monthlyToolCalls: 500,
      storageRetention: 7 // days
    }
  },
  PRO: {
    name: 'Pro',
    price: 2999, // $29.99/month in cents
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Hosted MCP endpoint',
      'Up to 10 team members',
      'Team collaboration dashboard',
      'Supabase integration',
      'GitHub/GitLab CI hooks',
      'Priority support',
      '90-day session history'
    ],
    limits: {
      teamMembers: 10,
      sessions: 50,
      monthlyToolCalls: 10000,
      storageRetention: 90
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 0, // Custom pricing
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'SSO integration',
      'Private cloud deployment',
      'Advanced audit logging',
      'Custom integrations',
      'SLA guarantees',
      '1-year session history'
    ],
    limits: {
      teamMembers: Infinity,
      sessions: Infinity,
      monthlyToolCalls: Infinity,
      storageRetention: 365
    }
  }
};

export class BillingService {
  constructor(private prisma: PrismaClient) {}

  async createCustomer(userId: string, email: string, name?: string) {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId }
    });

    return customer;
  }

  async createSubscription(teamId: string, plan: Plan, customerId: string) {
    if (plan === 'FREE') {
      // Free plan doesn't need Stripe subscription
      return null;
    }

    const priceId = plan === 'PRO' ? PRICING_PLANS.PRO.stripePriceId : undefined;
    if (!priceId) {
      throw new Error(`No price ID configured for plan: ${plan}`);
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      metadata: { teamId },
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });

    // Update team with subscription info
    await this.prisma.team.update({
      where: { id: teamId },
      data: {
        plan,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id
      }
    });

    return subscription;
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const teamId = subscription.metadata.teamId;
    if (!teamId) return;

    await this.prisma.team.update({
      where: { id: teamId },
      data: { stripeSubscriptionId: subscription.id }
    });
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const team = await this.prisma.team.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!team) return;

    // Determine plan based on subscription status and price
    let newPlan: Plan = 'FREE';
    if (subscription.status === 'active') {
      const priceId = subscription.items.data[0]?.price.id;
      if (priceId === PRICING_PLANS.PRO.stripePriceId) {
        newPlan = 'PRO';
      }
    }

    await this.prisma.team.update({
      where: { id: team.id },
      data: { plan: newPlan }
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const team = await this.prisma.team.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!team) return;

    // Downgrade to free plan
    await this.prisma.team.update({
      where: { id: team.id },
      data: { 
        plan: 'FREE',
        stripeSubscriptionId: null
      }
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // Log successful payment, send confirmation email, etc.
    console.log(`Payment succeeded for invoice: ${invoice.id}`);
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    // Handle failed payment - notify customer, pause service, etc.
    console.log(`Payment failed for invoice: ${invoice.id}`);
    
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const team = await this.prisma.team.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (team) {
      // Could temporarily disable features or send notifications
      console.log(`Team ${team.name} payment failed - consider action`);
    }
  }

  async getUsage(teamId: string, month?: Date) {
    const startDate = month || new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // Get usage from audit logs
    const toolCalls = await this.prisma.auditLog.count({
      where: {
        teamId,
        action: { startsWith: 'tool.' },
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    const activeSessions = await this.prisma.session.count({
      where: {
        teamId,
        status: 'ACTIVE',
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      }
    });

    return {
      toolCalls,
      activeSessions,
      period: { start: startDate, end: endDate }
    };
  }

  async checkLimits(teamId: string): Promise<{ allowed: boolean; reason?: string }> {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true }
    });

    if (!team) return { allowed: false, reason: 'Team not found' };

    const planLimits = PRICING_PLANS[team.plan].limits;
    const usage = await this.getUsage(teamId);

    // Check team size
    if (team.members.length > planLimits.teamMembers) {
      return { allowed: false, reason: 'Team size limit exceeded' };
    }

    // Check monthly tool calls
    if (usage.toolCalls >= planLimits.monthlyToolCalls) {
      return { allowed: false, reason: 'Monthly tool call limit exceeded' };
    }

    return { allowed: true };
  }
}