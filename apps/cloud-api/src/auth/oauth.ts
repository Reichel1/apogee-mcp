import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import jwt from '@fastify/jwt';

export interface OAuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: 'github' | 'google';
  providerId: string;
}

export async function setupOAuth(fastify: FastifyInstance, prisma: PrismaClient) {
  // JWT configuration
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
    sign: { expiresIn: '7d' }
  });

  // GitHub OAuth
  await fastify.register(require('@fastify/oauth2'), {
    name: 'github',
    credentials: {
      client: {
        id: process.env.GITHUB_CLIENT_ID!,
        secret: process.env.GITHUB_CLIENT_SECRET!
      },
      auth: {
        authorizeHost: 'https://github.com',
        authorizePath: '/login/oauth/authorize',
        tokenHost: 'https://github.com',
        tokenPath: '/login/oauth/access_token'
      }
    },
    startRedirectPath: '/auth/github',
    callbackUri: `${process.env.BASE_URL}/auth/github/callback`,
    scope: ['user:email']
  });

  // Google OAuth
  await fastify.register(require('@fastify/oauth2'), {
    name: 'google',
    credentials: {
      client: {
        id: process.env.GOOGLE_CLIENT_ID!,
        secret: process.env.GOOGLE_CLIENT_SECRET!
      },
      auth: {
        authorizeHost: 'https://accounts.google.com',
        authorizePath: '/o/oauth2/v2/auth',
        tokenHost: 'https://www.googleapis.com',
        tokenPath: '/oauth2/v4/token'
      }
    },
    startRedirectPath: '/auth/google',
    callbackUri: `${process.env.BASE_URL}/auth/google/callback`,
    scope: ['profile', 'email']
  });

  // GitHub callback
  fastify.get('/auth/github/callback', async (request, reply) => {
    try {
      const { token } = await fastify.github.getAccessTokenFromAuthorizationCodeFlow(request);
      
      // Get user info from GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      const githubUser = await userResponse.json();

      // Get user email
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${token.access_token}` }
      });
      const emails = await emailResponse.json();
      const primaryEmail = emails.find((email: any) => email.primary)?.email;

      const oauthUser: OAuthUser = {
        id: githubUser.id.toString(),
        email: primaryEmail || githubUser.email,
        name: githubUser.name,
        avatarUrl: githubUser.avatar_url,
        provider: 'github',
        providerId: githubUser.id.toString()
      };

      const jwtToken = await createOrUpdateUser(prisma, oauthUser);
      
      reply.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`);
    } catch (error) {
      fastify.log.error('GitHub OAuth error:', error);
      reply.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  });

  // Google callback  
  fastify.get('/auth/google/callback', async (request, reply) => {
    try {
      const { token } = await fastify.google.getAccessTokenFromAuthorizationCodeFlow(request);
      
      // Get user info from Google
      const userResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`);
      const googleUser = await userResponse.json();

      const oauthUser: OAuthUser = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.picture,
        provider: 'google', 
        providerId: googleUser.id
      };

      const jwtToken = await createOrUpdateUser(prisma, oauthUser);
      
      reply.redirect(`${process.env.FRONTEND_URL}/auth/success?token=${jwtToken}`);
    } catch (error) {
      fastify.log.error('Google OAuth error:', error);
      reply.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  });
}

async function createOrUpdateUser(prisma: PrismaClient, oauthUser: OAuthUser): Promise<string> {
  const providerField = oauthUser.provider === 'github' ? 'githubId' : 'googleId';
  
  // Try to find existing user by provider ID
  let user = await prisma.user.findUnique({
    where: { [providerField]: oauthUser.providerId }
  });

  if (!user) {
    // Try to find by email and link accounts
    user = await prisma.user.findUnique({
      where: { email: oauthUser.email }
    });

    if (user) {
      // Link OAuth account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: { [providerField]: oauthUser.providerId }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: oauthUser.email,
          name: oauthUser.name,
          avatarUrl: oauthUser.avatarUrl,
          [providerField]: oauthUser.providerId
        }
      });
    }
  }

  // Create JWT token with user and team info
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    // Add default team if user has none - we'll implement this
  };

  // This would be injected as fastify.jwt in the actual implementation
  const token = jwt.sign(payload);
  return token;
}