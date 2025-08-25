import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { email, name, company, role, source } = req.body

      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      // Create lead data with MCP website tagging
      const leadData = {
        id: Date.now().toString(), // Simple ID generation
        email,
        name: name || null,
        company: company || null,
        role: role || null,
        source: source || 'website',
        tags: ['mcp-website'],
        createdAt: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }

      // Log the lead (in production, send to your analytics/CRM)
      console.log('New MCP Lead:', JSON.stringify(leadData, null, 2))

      // Here you could:
      // 1. Send to your existing CRM/database via API
      // 2. Send to email service (Resend, SendGrid, etc.)
      // 3. Send to analytics (PostHog, Mixpanel, etc.)
      // 4. Send webhook to Zapier/Make.com for processing

      // Example: Send to webhook endpoint
      // await fetch('https://hooks.zapier.com/hooks/catch/your-webhook/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(leadData)
      // })

      return res.status(200).json({ 
        success: true, 
        message: 'Lead captured successfully',
        id: leadData.id 
      })
    } catch (error) {
      console.error('Failed to capture lead:', error)
      return res.status(500).json({ error: 'Failed to save lead' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}