import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { 
        email, 
        name, 
        company, 
        role,
        useCase, 
        teamSize, 
        message,
        preferredDate,
        timeZone 
      } = req.body

      if (!email) {
        return res.status(400).json({ error: 'Email is required' })
      }

      // Create demo request data with MCP website tagging
      const demoRequestData = {
        id: Date.now().toString(),
        type: 'demo_request',
        email,
        name: name || null,
        company: company || null,
        role: role || null,
        useCase: useCase || null,
        teamSize: teamSize || null,
        message: message || null,
        preferredDate: preferredDate || null,
        timeZone: timeZone || null,
        source: 'demo',
        tags: ['mcp-website', 'demo-request'],
        status: 'pending',
        createdAt: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      }

      // Log the demo request (in production, send to your CRM/notification system)
      console.log('New MCP Demo Request:', JSON.stringify(demoRequestData, null, 2))

      // Here you could:
      // 1. Send email notification to your team
      // 2. Create calendar booking link
      // 3. Add to CRM with high priority
      // 4. Send auto-response email to user
      // 5. Trigger Slack/Discord notification

      // Example: Send notification email
      // await fetch('/api/send-notification', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     type: 'demo_request',
      //     data: demoRequestData
      //   })
      // })

      return res.status(200).json({ 
        success: true, 
        message: 'Demo request submitted successfully',
        id: demoRequestData.id,
        nextSteps: 'We\'ll contact you within 24 hours to schedule your demo'
      })
    } catch (error) {
      console.error('Failed to process demo request:', error)
      return res.status(500).json({ error: 'Failed to save demo request' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}