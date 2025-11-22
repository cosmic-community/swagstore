import { getAboutPage } from '@/lib/cosmic'
import { AboutPage } from '@/types'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - SwagStore',
  description: 'Learn more about SwagStore and our mission to provide premium branded merchandise'
}

export default async function About() {
  const aboutData = await getAboutPage()
  const about = aboutData as AboutPage | null

  // Default content if no Cosmic data is available
  const pageTitle = about?.metadata?.page_title || 'About SwagStore'
  const heroImage = about?.metadata?.hero_image?.imgix_url
  const companyDescription = about?.metadata?.company_description || 'We are dedicated to providing premium branded merchandise for businesses of all sizes.'
  const missionStatement = about?.metadata?.mission_statement
  const visionStatement = about?.metadata?.vision_statement
  const companyValues = about?.metadata?.company_values
  const teamSectionTitle = about?.metadata?.team_section_title || 'Our Team'
  const teamMembers = about?.metadata?.team_members || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
        style={heroImage ? {
          backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.8), rgba(30, 64, 175, 0.8)), url(${heroImage}?w=2000&h=600&fit=crop&auto=format,compress)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed">
              {companyDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      {(missionStatement || visionStatement) && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {missionStatement && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Mission</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {missionStatement}
                  </p>
                </div>
              )}
              {visionStatement && (
                <div className="bg-white p-8 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold text-blue-600 mb-4">Our Vision</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {visionStatement}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Company Values */}
      {companyValues && (
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {companyValues}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {teamMembers.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">{teamSectionTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {member.image?.imgix_url && (
                    <img
                      src={`${member.image.imgix_url}?w=800&h=800&fit=crop&auto=format,compress`}
                      alt={member.name}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Explore our collection of premium branded merchandise
          </p>
          <a
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  )
}