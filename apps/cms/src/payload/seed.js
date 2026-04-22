import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { getPayload } from 'payload'

import config from '../../payload.config.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** 1x1 PNG */
const PLACEHOLDER_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

const lexicalParagraph = (text) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: null,
        format: '',
        indent: 0,
        textFormat: 0,
        textStyle: '',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
})

function ensurePlaceholderFile() {
  const dir = path.join(__dirname, 'seed-assets')
  const dest = path.join(dir, 'placeholder.png')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(dest)) {
    fs.writeFileSync(dest, Buffer.from(PLACEHOLDER_B64, 'base64'))
  }
  return dest
}

async function ensureSeedMedia(payload) {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'Seed catalog placeholder' } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'Seed catalog placeholder' },
    filePath: ensurePlaceholderFile(),
  })
  return doc.id
}

async function upsertBySlug(payload, collection, slug, data) {
  // Explicitly include _status: 'published' so draft-enabled collections are
  // immediately visible to unauthenticated REST reads (staffOrPublished access).
  const publishedData = { ...data, _status: 'published' }

  const found = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    draft: true,
  })
  if (found.docs[0]) {
    await payload.update({
      collection,
      id: found.docs[0].id,
      data: publishedData,
      draft: false,
    })
    return found.docs[0].id
  }
  const doc = await payload.create({
    collection,
    data: publishedData,
    draft: false,
  })
  return doc.id
}

/**
 * Idempotent product-variant upsert by SKU (draft-enabled collection).
 */
async function upsertVariantBySku(payload, sku, data) {
  const publishedData = { ...data, sku, _status: 'published' }
  const found = await payload.find({
    collection: 'product-variants',
    where: { sku: { equals: sku } },
    limit: 1,
    draft: true,
  })
  if (found.docs[0]) {
    await payload.update({
      collection: 'product-variants',
      id: found.docs[0].id,
      data: publishedData,
      draft: false,
    })
    return found.docs[0].id
  }
  const doc = await payload.create({
    collection: 'product-variants',
    data: publishedData,
    draft: false,
  })
  return doc.id
}

async function seed() {
  const payload = await getPayload({ config })

  // ── One-time cleanups ─────────────────────────────────────────────
  // Remove the stale 'general-consultation' slug that was created before
  // it was renamed to 'consultation' in the updated seed.
  const staleConsultation = await payload.find({
    collection: 'services',
    where: { slug: { equals: 'general-consultation' } },
    limit: 1,
    draft: true,
  })
  if (staleConsultation.docs[0]) {
    await payload.delete({ collection: 'services', id: staleConsultation.docs[0].id })
    payload.logger.info('Removed stale service: general-consultation')
  }

  const mediaId = await ensureSeedMedia(payload)

  const featuredCollectionId = await upsertBySlug(payload, 'product-collections', 'featured', {
    title: 'Featured',
    slug: 'featured',
    description: 'Baseline collection for Phase-1 catalog.',
    displayOrder: 0,
    featured: true,
    coverImage: mediaId,
  })

  const framesCollectionId = await upsertBySlug(payload, 'product-collections', 'frames', {
    title: 'Frames',
    slug: 'frames',
    description: 'Optical frames for everyday clarity.',
    displayOrder: 10,
    featured: false,
    coverImage: mediaId,
  })

  const sunglassesCollectionId = await upsertBySlug(payload, 'product-collections', 'sunglasses', {
    title: 'Sunglasses',
    slug: 'sunglasses',
    description: 'UV protection and style.',
    displayOrder: 20,
    featured: false,
    coverImage: mediaId,
  })

  const contactsCollectionId = await upsertBySlug(payload, 'product-collections', 'soft-contact-lenses', {
    title: 'Soft contact lenses',
    slug: 'soft-contact-lenses',
    description: 'Daily comfort contact lenses.',
    displayOrder: 30,
    featured: false,
    coverImage: mediaId,
  })

  const careCollectionId = await upsertBySlug(payload, 'product-collections', 'lens-care', {
    title: 'Lens care',
    slug: 'lens-care',
    description: 'Solutions and drops for lens care.',
    displayOrder: 40,
    featured: false,
    coverImage: mediaId,
  })

  const accessoriesCollectionId = await upsertBySlug(payload, 'product-collections', 'accessories', {
    title: 'Accessories',
    slug: 'accessories',
    description: 'Cases, cloths, and extras.',
    displayOrder: 50,
    featured: false,
    coverImage: mediaId,
  })

  const frameProductId = await upsertBySlug(payload, 'products', 'sample-frame', {
    productType: 'optical-frame',
    name: 'Sample Optical Frame',
    slug: 'sample-frame',
    brand: 'Eyesoul',
    gtin: '0890000000001',
    featured: true,
    badges: ['new'],
    description: lexicalParagraph('Sample optical frame for catalog preview.'),
    price: 129,
    availabilityStatus: 'in-stock',
    images: [mediaId],
    collections: [featuredCollectionId, framesCollectionId],
    frame: {
      frameShape: 'rectangle',
      rimType: 'full-rim',
      frameColor: 'Matte Black',
      rxAble: true,
    },
    specs: {
      showSpecsOnPdp: true,
      bridgeMm: 18,
      templeMm: 145,
      lensWidthMm: 52,
      lensHeightMm: 42,
      lensType: 'single-vision',
      lensMaterial: 'polycarbonate',
      lensTreatment: 'anti-reflective',
      frameMaterial: 'acetate',
      fitNotes: 'Medium fit for most adults.',
      faceShapeHints: 'Oval, heart',
      dimensionDiagram: mediaId,
    },
    videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    videoPoster: mediaId,
  })

  const sunglassesProductId = await upsertBySlug(payload, 'products', 'sample-sunglasses', {
    productType: 'sunglasses',
    name: 'Sample Sunglasses',
    slug: 'sample-sunglasses',
    brand: 'Eyesoul',
    badges: ['bestseller'],
    description: lexicalParagraph('Polarized sunglasses seed product.'),
    price: 149,
    availabilityStatus: 'available',
    images: [mediaId],
    collections: [featuredCollectionId, sunglassesCollectionId],
    frame: {
      frameShape: 'aviator',
      rimType: 'full-rim',
      frameColor: 'Gold',
      rxAble: false,
      lensColor: 'Smoke',
      polarized: true,
      uv400: true,
      lensCategory: 3,
    },
    specs: {
      showSpecsOnPdp: true,
      bridgeMm: 17,
      templeMm: 140,
      lensWidthMm: 55,
      lensHeightMm: 45,
      frameMaterial: 'metal',
      fitNotes: 'Lightweight metal frame.',
    },
  })

  const softLensProductId = await upsertBySlug(payload, 'products', 'sample-softlens', {
    productType: 'contact-soft',
    name: 'Sample Soft Contact Lenses',
    slug: 'sample-softlens',
    brand: 'Eyesoul',
    badges: ['new'],
    description: lexicalParagraph('Soft contact lenses seed product (catalog-only).'),
    price: 19.9,
    availabilityStatus: 'in-stock',
    images: [mediaId],
    collections: [contactsCollectionId],
    contactLens: {
      replacementSchedule: 'daily',
      unitsPerBox: 30,
      baseCurveOptionsMm: [8.4, 8.8],
      diameterOptionsMm: [14.0, 14.2],
      spherePowerRange: { min: -10, max: 6, step: 0.25 },
      hasCylinder: true,
      cylinderPowerRange: { min: -2.25, max: -0.25, step: 0.25 },
      axisStep: 10,
      hasAdd: true,
      addPowerRange: { min: 0.75, max: 2.5, step: 0.25 },
      materialType: 'silicone-hydrogel',
      waterContentPercent: 46,
      dkT: 120,
      wearingModality: 'daily-wear',
    },
  })

  const careProductId = await upsertBySlug(payload, 'products', 'sample-solution', {
    productType: 'contact-care',
    name: 'Sample Lens Solution',
    slug: 'sample-solution',
    brand: 'Eyesoul',
    description: lexicalParagraph('Multipurpose solution seed product.'),
    price: 9.9,
    availabilityStatus: 'available',
    images: [mediaId],
    collections: [careCollectionId],
    careProduct: {
      unitOfMeasure: 'bottle',
      unitVolumeMl: 300,
      unitsPerPack: 1,
      compatibility: 'all',
    },
  })

  const accessoryProductId = await upsertBySlug(payload, 'products', 'sample-case', {
    productType: 'accessory',
    name: 'Sample Eyewear Case',
    slug: 'sample-case',
    brand: 'Eyesoul',
    description: lexicalParagraph('Protective case seed product.'),
    price: 12,
    availabilityStatus: 'in-stock',
    images: [mediaId],
    collections: [accessoriesCollectionId],
    accessory: {
      accessoryType: 'case',
      unitsPerPack: 1,
      compatibilityNotes: 'Fits most adult frames.',
    },
  })

  await upsertVariantBySku(payload, 'FRAME-BLK-52-18-145', {
    product: frameProductId,
    title: 'Matte Black / 52-18-145',
    gtin: '0890000001001',
    images: [mediaId],
    attributes: {
      colorName: 'Matte Black',
      colorCode: '#1a1a1a',
      lensWidthMm: 52,
      bridgeMm: 18,
      templeMm: 145,
    },
  })

  await upsertVariantBySku(payload, 'SUN-GLD-55-17-140', {
    product: sunglassesProductId,
    title: 'Gold / 55-17-140',
    images: [mediaId],
    attributes: { colorName: 'Gold', lensWidthMm: 55, bridgeMm: 17, templeMm: 140 },
  })

  await upsertBySlug(payload, 'stores', 'flagship-store', {
    name: 'Flagship Store',
    slug: 'flagship-store',
    address: '123 Example Street\nJakarta',
    city: 'Jakarta',
    region: 'Java',
    phone: '+62-21-0000-0000',
    whatsApp: 'https://wa.me/6281234567890',
    email: 'store@example.com',
    mapsUrl: 'https://maps.google.com',
    latitude: -6.2,
    longitude: 106.8,
    hours: [
      { day: 'mon', open: '10:00', close: '20:00' },
      { day: 'sat', open: '10:00', close: '18:00' },
    ],
  })

  // ── Core Services ────────────────────────────────────────────────
  await upsertBySlug(payload, 'services', 'eye-exam', {
    name: 'Eye Exam',
    slug: 'eye-exam',
    description:
      'A comprehensive eye exam is the foundation of your visual health. Our certified optometrists use advanced diagnostics to give you a complete picture of your vision.',
    icon: mediaId,
    displayOrder: 0,
    category: 'core_service',
    serviceType: 'exam',
    bookingUrl: 'https://cal.com',
    primaryCtaLabel: 'Book eye exam',
    processSteps: [
      { title: 'Book your appointment', description: 'Schedule online or by phone in under 2 minutes.' },
      { title: 'Vision history review', description: 'A short consultation about your lifestyle and any current vision concerns.' },
      { title: 'Digital refraction & acuity testing', description: 'We use state-of-the-art digital equipment for precise measurements.' },
      { title: 'Optometrist evaluation', description: 'A certified optometrist reviews your results and checks for any conditions.' },
      { title: 'Prescription & recommendations', description: 'You leave with a full prescription and personalised eyewear advice.' },
    ],
    faqs: [
      { question: 'How long does an eye exam take?', answer: 'A comprehensive exam typically takes 30–45 minutes.' },
      { question: 'How often should I get an eye exam?', answer: 'Once a year is recommended for most adults; more frequently if you have an existing eye condition.' },
      { question: 'Does it hurt?', answer: 'Not at all. The exam is entirely non-invasive and painless.' },
      { question: 'Do I need to bring anything?', answer: 'Bring your current glasses or contact lenses if you have them, and any relevant medical history.' },
      { question: 'Is the exam free?', answer: 'Yes — all Eyesoul customers receive a complimentary eye exam as part of our service promise.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'contact-lens-fitting', {
    name: 'Contact Lens Fitting',
    slug: 'contact-lens-fitting',
    description:
      'Contact lenses are not one-size-fits-all. Our specialists measure the unique curvature of your eye to find the lens that fits perfectly — for comfort you will forget you are wearing them.',
    icon: mediaId,
    displayOrder: 10,
    category: 'core_service',
    serviceType: 'fitting',
    bookingUrl: 'https://cal.com/contact-lens',
    primaryCtaLabel: 'Book fitting',
    processSteps: [
      { title: 'Confirm your prescription', description: 'We verify or update your current prescription before proceeding.' },
      { title: 'Corneal curvature measurement', description: 'Precise topography mapping of your eye surface to find the right lens parameters.' },
      { title: 'Trial lens selection', description: 'We select a shortlist of trial lenses based on your measurements and lifestyle.' },
      { title: 'Comfort evaluation', description: 'You wear the trial lenses while our specialist checks fit, centration, and comfort.' },
      { title: 'Wear & care tutorial', description: 'Full instruction on safe insertion, removal, and daily care.' },
    ],
    faqs: [
      { question: 'Can anyone wear contact lenses?', answer: 'Most people can, but a professional fitting is essential to confirm suitability for your specific eyes.' },
      { question: 'How long does the fitting take?', answer: 'Typically 45–60 minutes including trial wear time.' },
      { question: 'What if the lenses feel uncomfortable?', answer: 'We will try different lens types and brands until we find the right fit — at no extra cost.' },
      { question: 'Do I need a separate prescription for contacts?', answer: 'Yes — contact lens prescriptions differ from glasses prescriptions. We will verify yours during the fitting.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'frame-adjustment', {
    name: 'Frame Adjustment',
    slug: 'frame-adjustment',
    description:
      'A poorly fitted frame causes discomfort, pressure marks, and can distort your vision. Our in-store specialists will have your glasses sitting perfectly in minutes — no appointment required.',
    icon: mediaId,
    displayOrder: 20,
    category: 'core_service',
    serviceType: 'adjustments',
    bookingPhone: '+62-21-0000-0001',
    primaryCtaLabel: 'Find a store',
    processSteps: [
      { title: 'Walk into any Eyesoul store', description: 'No appointment needed. Our team is ready to help during all store hours.' },
      { title: 'Frame assessment', description: 'We check the bridge, temple arms, and nose pads for alignment and pressure points.' },
      { title: 'Precise adjustments', description: 'Using professional tools, we reshape and align your frame to your unique face.' },
      { title: 'Comfort verification', description: 'You try the adjusted frame and we make any final micro-tweaks until it feels perfect.' },
    ],
    faqs: [
      { question: 'Do I need an appointment?', answer: 'No — walk-ins are always welcome for frame adjustments.' },
      { question: 'How much does it cost?', answer: 'Frame adjustments are complimentary at every Eyesoul store location.' },
      { question: 'What if my frame is from another brand?', answer: 'We can adjust most frames as a courtesy service, though we cannot guarantee results on all brands.' },
      { question: 'How long does it take?', answer: 'Usually under 15 minutes for a standard adjustment.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'consultation', {
    name: 'General Consultation',
    slug: 'consultation',
    description:
      'Not sure where to start? Whether it is a question about your prescription, advice on frames for your face shape, or understanding your eye health results — our consultants are here to listen.',
    displayOrder: 30,
    category: 'core_service',
    serviceType: 'other',
    primaryCtaLabel: 'Talk to us',
    processSteps: [
      { title: 'Book a slot or walk in', description: 'No preparation required. Just show up at any store or call ahead.' },
      { title: 'Tell us what you need', description: 'No question is too small. Prescription queries, style advice, post-purchase support — we cover everything.' },
      { title: 'Personalised guidance', description: 'Our consultant listens and provides tailored advice matched to your lifestyle and budget.' },
      { title: 'Clear next step', description: 'You leave with a clear recommendation — whether that is an exam, a fitting, or a browse through the collection.' },
    ],
    faqs: [
      { question: 'Is there a charge for a consultation?', answer: 'No — general consultations are completely free, with no obligation to purchase.' },
      { question: 'What topics can I ask about?', answer: 'Anything vision-related: prescriptions, lens types, brands, pricing, face shape matching, lifestyle fit, and more.' },
      { question: 'Can I bring a family member?', answer: 'Of course. We welcome you to bring anyone along.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'home-service', {
    name: 'Home Service',
    slug: 'home-service',
    description:
      'Can\'t make it to a store? Our specialist team comes to you. Full eye exam, frame fitting, and prescription service — delivered to your home at no extra charge.',
    icon: mediaId,
    displayOrder: 35,
    category: 'core_service',
    serviceType: 'other',
    primaryCtaLabel: 'Request home visit',
    processSteps: [
      { title: 'Request a visit', description: 'Contact us via WhatsApp or phone. Tell us your address and preferred time.' },
      { title: 'We confirm your booking', description: 'Our team will confirm a convenient slot and let you know who to expect.' },
      { title: 'Specialist arrives', description: 'Our trained optometrist arrives with full diagnostic equipment and a curated frame selection.' },
      { title: 'Complete session at home', description: 'Eye exam, frame trial, and order placement — all done in the comfort of your home.' },
      { title: 'Delivery to your door', description: 'Your finished eyewear is delivered directly to you once ready.' },
    ],
    faqs: [
      { question: 'Which areas are covered?', answer: 'Contact us to check if your location is within our current service area — we are expanding regularly.' },
      { question: 'Is there an extra charge for home visits?', answer: 'No — home service visits are complimentary for Eyesoul customers.' },
      { question: 'Do I need to prepare anything?', answer: 'Just a well-lit space and your current glasses or contacts if you have them.' },
      { question: 'Can I order frames during the visit?', answer: 'Yes — our specialist brings a curated selection of frames and can place your order on the spot.' },
      { question: 'How long does a home visit take?', answer: 'A full session typically takes 60–90 minutes depending on what you need.' },
    ],
  })

  // ── Premium Benefits ──────────────────────────────────────────────
  await upsertBySlug(payload, 'services', 'free-eye-exam', {
    name: 'Free Eye Exam',
    slug: 'free-eye-exam',
    description:
      'Every Eyesoul customer receives a complimentary professional eye exam — no purchase required. Because knowing your vision is the first step to protecting it.',
    icon: mediaId,
    displayOrder: 40,
    category: 'premium_benefit',
    serviceType: 'exam',
    primaryCtaLabel: 'Claim free exam',
    processSteps: [
      { title: 'Walk in or book online', description: 'Available at every Eyesoul location — no referral or purchase needed.' },
      { title: 'Full professional exam', description: 'Identical to our standard paid exam, performed by certified optometrists.' },
      { title: 'Instant results', description: 'Your prescription and findings are shared with you immediately after the exam.' },
    ],
    faqs: [
      { question: 'Who qualifies for the free exam?', answer: 'All Eyesoul customers and any walk-in visitor — no purchase required.' },
      { question: 'Is it the same quality as a paid exam?', answer: 'Yes — identical process, same certified optometrists, same equipment.' },
      { question: 'Do I need to buy anything afterwards?', answer: 'Absolutely not. This is our unconditional gift to you.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'free-home-service', {
    name: 'Free Home Service',
    slug: 'free-home-service',
    description:
      'Cannot make it to a store? Our specialists will bring the full Eyesoul experience directly to your home — from eye exams to frame selection, at zero extra charge.',
    icon: mediaId,
    displayOrder: 50,
    category: 'premium_benefit',
    serviceType: 'other',
    primaryCtaLabel: 'Request home visit',
    processSteps: [
      { title: 'Request a home visit', description: 'Contact us via WhatsApp or phone to request a home appointment.' },
      { title: 'Confirm your details', description: 'We confirm your address, preferred date and time, and any special requirements.' },
      { title: 'Specialist arrives', description: 'Our specialist comes to you with full diagnostic equipment and our frame collection.' },
      { title: 'Complete session at home', description: 'Eye exam, frame selection, and order placement — everything done in the comfort of your home.' },
    ],
    faqs: [
      { question: 'Which areas are covered?', answer: 'Contact us to check current coverage — we are actively expanding our home service zones.' },
      { question: 'Is there really no extra charge?', answer: 'None whatsoever. Home visits are an Eyesoul privilege at no additional cost.' },
      { question: 'How long does a home visit take?', answer: 'Approximately 60–90 minutes for a full session including exam and frame selection.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'frame-guarantee', {
    name: '18-Month Frame Guarantee',
    slug: 'frame-guarantee',
    description:
      'Every frame purchased at Eyesoul is backed by our 18-month guarantee. Defects, warping, hinge issues — we will repair or replace at no cost. No receipts needed. No questions asked.',
    icon: mediaId,
    displayOrder: 60,
    category: 'premium_benefit',
    serviceType: 'guarantee',
    primaryCtaLabel: 'Make a claim',
    processSteps: [
      { title: 'Identify the issue', description: 'Notice a defect, warping, or hinge problem? Bring the frame to any Eyesoul store.' },
      { title: 'Specialist assessment', description: 'Our team reviews the issue and confirms it falls within the guarantee coverage.' },
      { title: 'Repair or replacement', description: 'We repair or replace the frame — your choice — at no cost to you.' },
      { title: 'Done in 7 days', description: 'Most cases are resolved within 7 business days in-store.' },
    ],
    faqs: [
      { question: 'What does the guarantee cover?', answer: 'Manufacturing defects, material warping, and structural failures including hinges, temples, and bridges.' },
      { question: 'What is not covered?', answer: 'Accidental damage, scratched lenses, and damage caused by misuse or improper storage.' },
      { question: 'Do I need the original receipt?', answer: 'No — we track your purchase linked to your customer account. No receipt required.' },
      { question: 'How do I make a claim?', answer: 'Visit any Eyesoul store or contact us via WhatsApp and we will guide you through the process.' },
    ],
  })

  await upsertBySlug(payload, 'services', 'trade-in-program', {
    name: 'Lifetime Trade-In Program',
    slug: 'trade-in-program',
    description:
      'Life changes. Your prescription changes. Your style changes. With our Lifetime Trade-In Program, bring back any Eyesoul frame — ever — and put its value toward your next pair.',
    icon: mediaId,
    displayOrder: 70,
    category: 'premium_benefit',
    serviceType: 'trade-in',
    primaryCtaLabel: 'Trade in your frames',
    processSteps: [
      { title: 'Bring your Eyesoul frames', description: 'Visit any store with any Eyesoul frame you have purchased — regardless of age or condition.' },
      { title: 'Credit assessment', description: 'A specialist assesses the frame condition and calculates your trade-in credit value.' },
      { title: 'Browse the new collection', description: 'Explore our current collection and choose your next pair.' },
      { title: 'Credit applied at checkout', description: 'Your trade-in credit is deducted instantly at checkout — no vouchers, no waiting.' },
    ],
    faqs: [
      { question: 'Is there a time limit on the program?', answer: 'No — this is a lifetime program. Any Eyesoul frame, any age, qualifies.' },
      { question: 'How much credit will I receive?', answer: 'Credit value is assessed in-store based on frame age and condition.' },
      { question: 'Can I trade in multiple pairs at once?', answer: 'Yes — you can trade in as many frames as you have in one visit.' },
      { question: 'What happens to my old frames?', answer: 'They are either refurbished for resale or responsibly recycled as part of our sustainability commitment.' },
    ],
  })

  await upsertBySlug(payload, 'pages', 'about', {
    title: 'About',
    slug: 'about',
    blocks: [
      {
        blockType: 'hero',
        heading: 'About Eyesoul',
        subheading: 'Crafted eyewear for everyday clarity.',
        image: mediaId,
      },
      {
        blockType: 'content',
        body: lexicalParagraph(
          'This is seeded content from EP-1. Replace with your brand story in the admin.',
        ),
      },
      {
        blockType: 'faq',
        heading: 'Common questions',
        items: [
          {
            question: 'Do you offer eye exams?',
            answer: 'Yes — book an exam at one of our locations or use the booking link on the Services page.',
          },
          {
            question: 'What is your return policy?',
            answer: 'Contact the store where you purchased for returns and exchanges. Policies may vary by region.',
          },
        ],
      },
    ],
  })

  await upsertBySlug(payload, 'pages', 'contact', {
    title: 'Contact',
    slug: 'contact',
    blocks: [
      {
        blockType: 'content',
        body: lexicalParagraph('Reach us via the contact form or visit a store. (EP-1 seed)'),
      },
      {
        blockType: 'cta',
        label: 'WhatsApp',
        href: 'https://wa.me/6281234567890',
      },
    ],
  })

  const postId = await upsertBySlug(payload, 'posts', 'how-to-choose-eyewear', {
    title: 'How to choose eyewear for daily comfort',
    slug: 'how-to-choose-eyewear',
    excerpt: 'A practical guide to frame fit, lens choices, and comfort for all-day wear.',
    content: lexicalParagraph('Use this seed article as a baseline and replace with editorial content in admin.'),
    featuredImage: mediaId,
    category: 'Guides',
    authorName: 'Eyesoul Editorial Team',
    authorBio: 'Writers and optician collaborators at Eyesoul.',
    authorAvatar: mediaId,
    timeToRead: '4 min read',
  })

  const existingReview = await payload.find({
    collection: 'product-reviews',
    where: { product: { equals: frameProductId } },
    limit: 1,
    draft: true,
  })
  if (!existingReview.docs[0]) {
    await payload.create({
      collection: 'product-reviews',
      data: {
        product: frameProductId,
        rating: 5,
        title: 'Clear lenses, comfortable fit',
        body: lexicalParagraph('Lightweight frame and sharp optics — great for daily wear.'),
        authorName: 'Seed Customer',
        verified: true,
        _status: 'published',
      },
      draft: false,
    })
  }

  const existingSunglassesReview = await payload.find({
    collection: 'product-reviews',
    where: { product: { equals: sunglassesProductId } },
    limit: 1,
    draft: true,
  })
  if (!existingSunglassesReview.docs[0]) {
    await payload.create({
      collection: 'product-reviews',
      data: {
        product: sunglassesProductId,
        rating: 4,
        title: 'Great UV protection',
        body: lexicalParagraph('Comfortable for driving; polarized lenses cut glare well.'),
        authorName: 'Seed Shopper',
        verified: false,
        _status: 'published',
      },
      draft: false,
    })
  }

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      modules: [
        {
          blockType: 'heroModule',
          eyebrow: 'New season',
          heading: 'Clarity in every frame',
          subheading: 'Eyewear and vision care, crafted for daily life.',
          image: mediaId,
          ctaLabel: 'Shop catalog',
          ctaHref: '/catalog',
        },
        {
          blockType: 'seasonalBanner',
          heading: 'Spring lens care',
          body: 'Refresh your routine with solution bundles in store this month.',
          backgroundImage: mediaId,
          linkLabel: 'Shop lens care',
          linkHref: '/catalog',
        },
        {
          blockType: 'collectionSpotlight',
          heading: 'Shop by collection',
          subHeading: 'Explore by style',
          collections: [featuredCollectionId, framesCollectionId, sunglassesCollectionId],
        },
        {
          blockType: 'productRow',
          heading: 'Featured frames',
          subHeading: 'Bestsellers from the seed catalog',
          products: [frameProductId, sunglassesProductId],
        },
        {
          blockType: 'journalFeature',
          heading: 'From the journal',
          subHeading: 'Guides and stories',
          posts: [postId],
        },
      ],
    },
  })

  payload.logger.info('EP-1 seed completed.')
}

await seed()
process.exit(0)
