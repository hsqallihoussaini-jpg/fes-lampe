import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

  const form = new formidable.IncomingForm({ keepExtensions: true, uploadDir })

  form.parse(req, (err, fields, files) => {
    if(err){
      console.error('Upload error', err)
      return res.status(500).json({ error: 'Upload failed' })
    }

    const file = (files as any).file
    if(!file) return res.status(400).json({ error: 'No file uploaded' })

    const originalName = file.originalFilename || file.name || 'upload'
    const newFilename = `${Date.now()}-${originalName.replace(/[^a-z0-9.\-]/gi,'')}`
    const newPath = path.join(uploadDir, newFilename)

    try{
      fs.renameSync(file.filepath || file.path, newPath)
    }catch(e){
      console.error('Rename error', e)
    }

    const fileUrl = `/uploads/${newFilename}`
    return res.status(200).json({ fileUrl })
  })
}
