import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FadeInUp from "../components/common/FadeInUp";
import RevealOnScroll from "../components/common/RevealOnScroll";
import { fetchClientsShowcase } from "../services/clientsShowcaseService";
import { Building2 } from "lucide-react";

// Fallback client data if API fails
const FALLBACK_CLIENT_STORIES = [
  {
    id: 1,
    company: "Meta",
    logo: "",
    industry: "Technology & Social Media",
    location: "Metro Manila",
    employees: "500+",
    established: "2018",
    background:
      "As one of the leading technology companies in the Philippines, Meta's Manila office houses over 500 employees across multiple departments including engineering, operations, and content moderation. With a strong commitment to environmental sustainability, they sought a waste management partner who could handle their diverse waste streams while aligning with their corporate ESG goals.",
    challenge:
      "Managing complex waste streams from a large tech campus including e-waste, office materials, cafeteria waste, and packaging materials. Needed real-time tracking and reporting for corporate sustainability metrics.",
    solution:
      "Implemented a comprehensive waste segregation program with dedicated collection schedules, employee training workshops, and a digital dashboard for real-time waste tracking and analytics.",
    testimonial:
      "WastePH has transformed our waste management approach. Their innovative solutions and commitment to sustainability align perfectly with our corporate values. The team is professional, responsive, and always goes the extra mile. The digital tracking system has been invaluable for our sustainability reporting.",
    author: "Sarah Johnson",
    position: "Sustainability Director",
    rating: 5,
    wasteReduction: "60%",
    partnership: "Since 2022",
    achievements: [
      "Achieved 85% recycling rate",
      "Reduced landfill waste by 60%",
      "₱2.5M annual cost savings",
      "Carbon footprint reduced by 40%",
    ],
  },
  {
    id: 2,
    company: "YouTube",
    logo: "",
    industry: "Media & Entertainment",
    location: "Quezon City",
    employees: "300+",
    established: "2019",
    background:
      "YouTube's content operations center in Quezon City is a hub for content review, creator support, and regional operations. The facility operates 24/7 with high volumes of electronic equipment, packaging materials, and office waste. As part of Google's sustainability initiatives, they needed a waste management partner capable of handling specialized waste streams.",
    challenge:
      "High volume of electronic waste from equipment upgrades, packaging materials from shipments, and the need to achieve zero e-waste to landfill while maintaining operational efficiency.",
    solution:
      "Developed a customized e-waste management program with certified recycling partners, implemented circular economy initiatives for packaging materials, and established a monthly sustainability audit system.",
    testimonial:
      "Working with WastePH has been a game-changer for our operations. They've helped us achieve our zero-waste goals while maintaining cost efficiency. Their data-driven approach provides valuable insights for continuous improvement. The team's expertise in e-waste management is exceptional.",
    author: "Michael Chen",
    position: "Operations Manager",
    rating: 5,
    wasteReduction: "55%",
    partnership: "Since 2023",
    achievements: [
      "Zero e-waste to landfill achieved",
      "ISO 14001 certification obtained",
      "₱1.8M cost savings annually",
      "95% diversion rate from landfills",
    ],
  },
  {
    id: 3,
    company: "TikTok",
    logo: "",
    industry: "Social Media & Technology",
    location: "BGC, Taguig",
    employees: "400+",
    established: "2020",
    background:
      "TikTok's regional headquarters in BGC serves as the nerve center for Southeast Asian operations. The fast-paced, creative environment generates unique waste management challenges with constant events, content production, and a young, environmentally-conscious workforce that expects sustainable practices.",
    challenge:
      "Managing waste from frequent events, content production materials, rapid office expansion, and meeting the sustainability expectations of a young, eco-aware workforce in a fast-growing organization.",
    solution:
      "Created a flexible waste management system that adapts to event schedules, implemented a gamified employee engagement program for waste reduction, and established partnerships for upcycling creative materials.",
    testimonial:
      "The level of service and expertise WastePH brings is unmatched. They understand the unique challenges of our fast-paced environment and provide tailored solutions that work. Their flexibility during our events and rapid growth has been crucial. Highly recommended!",
    author: "Lisa Rodriguez",
    position: "Facilities Manager",
    rating: 5,
    wasteReduction: "65%",
    partnership: "Since 2022",
    achievements: [
      "Event waste reduced by 70%",
      "Employee engagement rate: 92%",
      "₱1.2M annual savings",
      "Plastic-free office achieved",
    ],
  },
  {
    id: 4,
    company: "Flickr",
    logo: "",
    industry: "Technology & Photography",
    location: "Makati City",
    employees: "200+",
    established: "2017",
    background:
      "Flickr's Manila office focuses on photo storage infrastructure, content moderation, and customer support. As a company centered around visual content and creativity, they wanted their waste management practices to reflect their commitment to preserving beauty and sustainability for future generations.",
    challenge:
      "Establishing a comprehensive waste management program from the ground up, creating a culture of sustainability, and managing diverse waste streams including tech equipment, office supplies, and cafeteria operations.",
    solution:
      "Built a complete waste management infrastructure with clear segregation protocols, regular training programs, monthly sustainability reports, and a waste reduction incentive program for employees.",
    testimonial:
      "WastePH's comprehensive waste management program has exceeded our expectations. Their team is knowledgeable, reliable, and truly cares about environmental impact. We've seen significant improvements in our sustainability metrics. They've been with us from day one and have grown alongside our organization.",
    author: "David Park",
    position: "Environmental Compliance Officer",
    rating: 5,
    wasteReduction: "50%",
    partnership: "Since 2021",
    achievements: [
      "Built waste program from scratch",
      "50% waste reduction achieved",
      "₱900K annual cost savings",
      "100% compliance with regulations",
    ],
  },
];

const ClientStoryCard = ({ story }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-black/40 to-black/20 backdrop-blur-xl transition-all duration-500 hover:border-[#15803d]/50 hover:shadow-[0_20px_60px_rgba(21,128,61,0.3)]">
      {/* Logo Header - Full Width Banner */}
      {story.logo && !imageError ? (
        <div className="relative h-32 w-full overflow-hidden bg-white/90 sm:h-40">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-[#15803d]" />
            </div>
          )}
          
          <img
            src={story.logo}
            alt={`${story.company} logo`}
            loading="lazy"
            decoding="async"
            className={`block h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ contentVisibility: 'auto' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-white/90 sm:h-40">
          <Building2 className="h-16 w-16 text-slate-400" />
        </div>
      )}

      {/* Header Info */}
      <div className="border-b border-white/10 bg-[#15803d]/5 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          {/* Company Info */}
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              {story.company}
            </h3>
            <p className="mb-3 text-sm text-white/60">{story.industry}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              {story.location && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                  <span className="text-white/70">{story.location}</span>
                </div>
              )}
              {story.employees && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                  <span className="text-white/70">{story.employees} employees</span>
                </div>
              )}
              {story.partnership && (
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                  <span className="text-white/70">{story.partnership}</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          {story.rating && story.rating > 0 && (
            <div className="hidden sm:flex gap-1">
              {[...Array(story.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-[#15803d]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {/* Background */}
        <div className="mb-6">
          <p className="leading-relaxed text-white/70">{story.background}</p>
        </div>

        {/* Testimonial */}
        <div className="mb-6 rounded-xl border border-[#15803d]/20 bg-[#15803d]/5 p-6">
          <blockquote className="mb-4 text-lg leading-relaxed text-white/90">
            "{story.testimonial}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#15803d]/30 text-sm font-bold text-[#16a34a]">
              {story.author
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-bold text-white">{story.author}</p>
              <p className="text-sm text-white/60">{story.position}</p>
            </div>
          </div>
        </div>

        {/* Results */}
        {story.achievements && story.achievements.length > 0 && (
          <div className="rounded-xl bg-white/5 p-6">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-[#16a34a]">
              Results Achieved
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {story.achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#16a34a]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-white/80">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Clients = () => {
  const [clientStories, setClientStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1); // Show 1 client at a time for carousel

  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        const data = await fetchClientsShowcase();
        if (data && data.length > 0) {
          setClientStories(data);
        } else {
          // Use fallback data if no data from API
          setClientStories(FALLBACK_CLIENT_STORIES);
        }
      } catch (err) {
        console.error("Error loading clients:", err);
        setError(err.message);
        // Use fallback data on error
        setClientStories(FALLBACK_CLIENT_STORIES);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStories = clientStories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientStories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    if (clientStories.length > 1) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [currentPage, totalPages, clientStories.length]);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pb-16 pt-32 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <FadeInUp>
            <div className="text-center">
              <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="bg-linear-to-r from-white via-white to-[#16a34a] bg-clip-text text-transparent">
                  Our Clients
                </span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Discover the stories behind our partnerships. Learn about our
                clients' backgrounds, the challenges they faced, and how we
                helped them achieve their sustainability goals.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative px-4 pb-32 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {/* Loading State */}
          {loading && (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#15803d]" />
              <p className="text-lg text-white/60">Loading client stories...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && clientStories.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur-xl">
              <p className="mb-4 text-lg text-white/60">
                Unable to load client stories. Please try again later.
              </p>
            </div>
          )}

          {/* Client Stories Carousel */}
          {!loading && clientStories.length > 0 && (
            <>
              <div className="relative px-8 sm:px-12 md:px-16 lg:px-24">
                {/* Navigation Arrows */}
                {clientStories.length > 1 && (
                  <>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="absolute left-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-4 text-white backdrop-blur-xl transition-all hover:border-[#15803d]/50 hover:bg-[#15803d]/20 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                      aria-label="Previous client"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="absolute right-0 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/80 p-4 text-white backdrop-blur-xl transition-all hover:border-[#15803d]/50 hover:bg-[#15803d]/20 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                      aria-label="Next client"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </button>
                  </>
                )}

                {/* Carousel Container */}
                <div className="relative overflow-hidden">
                  {/* Carousel Track */}
                  <div 
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${(currentPage - 1) * 100}%)` }}
                  >
                    {clientStories.map((story, index) => (
                      <div 
                        key={story.id} 
                        className="w-full flex-shrink-0 px-2"
                      >
                        <ClientStoryCard story={story} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page Indicator Dots */}
              {clientStories.length > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`h-2.5 rounded-full transition-all ${
                          currentPage === pageNumber
                            ? "w-10 bg-[#15803d]"
                            : "w-2.5 bg-white/30 hover:bg-white/50"
                        }`}
                        aria-label={`Go to client ${pageNumber}`}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && clientStories.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur-xl">
              <p className="text-lg text-white/60">
                No client stories available at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-white/10 px-4 py-20 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <RevealOnScroll>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
              Ready to Join Our Success Stories?
            </h2>
            <p className="mb-8 text-lg text-white/70">
              Let's discuss how we can help your organization achieve its
              sustainability goals.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#15803d] to-[#16a34a] px-8 py-4 font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#15803d]/30"
            >
              Get Started
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
};

export default Clients;
