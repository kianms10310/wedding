import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, 
})

export async function GET() {
  const PUBLIC_IDS = [
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1',
    'wedding1'
  ]

  const signedUrls = PUBLIC_IDS.map((publicId) =>
    cloudinary.url(publicId, {
      width: 600,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto'
    })
  )

  return NextResponse.json(signedUrls)
}