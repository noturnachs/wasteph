import React, { useState } from "react";
import { Link } from "react-router-dom";
import FadeInUp from "../components/common/FadeInUp";
import RevealOnScroll from "../components/common/RevealOnScroll";
import flickrLogo from "../assets/clients/flickr.svg";
import metaLogo from "../assets/clients/meta.svg";
import tiktokLogo from "../assets/clients/tiktok.svg";
import youtubeLogo from "../assets/clients/youtube.svg";

// Mock client data with detailed backgrounds and testimonials
const CLIENT_STORIES = [
  {
    id: 1,
    company: "Meta",
    logo: metaLogo,
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
    logo: youtubeLogo,
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
    logo: tiktokLogo,
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
    logo: flickrLogo,
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
  return (
    <div className="pointer-events-auto group overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-black/40 to-black/20 backdrop-blur-xl transition-all duration-500 hover:border-[#15803d]/50 hover:shadow-[0_20px_60px_rgba(21,128,61,0.3)]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#15803d]/5 p-6 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Logo */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/5 p-3 sm:h-20 sm:w-20">
            <img
              src={story.logo}
              alt={`${story.company} logo`}
              className="h-full w-auto brightness-0 invert opacity-70"
            />
          </div>

          {/* Company Info */}
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
              {story.company}
            </h3>
            <p className="mb-3 text-sm text-white/60">{story.industry}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                <span className="text-white/70">{story.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                <span className="text-white/70">
                  {story.employees} employees
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" />
                <span className="text-white/70">{story.partnership}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
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
      </div>
    </div>
  );
};

const Clients = () => {
  return (
    <div className="pointer-events-none relative min-h-screen">
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
          {/* Client Stories */}
          <div className="space-y-8">
            {CLIENT_STORIES.map((story, index) => (
              <RevealOnScroll key={story.id} delay={index * 0.1}>
                <ClientStoryCard story={story} />
              </RevealOnScroll>
            ))}
          </div>
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
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#15803d] to-[#16a34a] px-8 py-4 font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#15803d]/30"
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
