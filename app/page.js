'use client'
import React, { useState } from 'react';
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Home() {

  const [hoveredCard, setHoveredCard] = useState(null);

  const teachers = [
    {
      id: 1,
      name: "Shaykh Kamil Ahmad",
      image: "/images/t1.png",
      bio: "Shaykh Kamil Ahmad studied at the Islamic University of Madinah where he graduated with a bachelors degree from the faculty of Shariʿah in 2009. He then went on to complete a post-graduate diploma in Daʿwah from the faculty of Daʿwah & Usul-ud-Din. Upon completing his studies in Madinah, he went on to pursue a masters degree in ʿAqidah & Contemporary Ideologies from Qassim University. His research concentrated on the New Atheism and its impact on Muslims. Shaykh Kamil has been teaching for the Islamic Online University since 2010 where he currently serves as senior lecturer for the MAIS (Masters in Islamic Studies) program. He currently serves as the resident Imam & Director of Religious Affairs at the Toronto Islamic Centre.",
      specializations: ["Shariʿah", "ʿAqidah", "Contemporary Ideologies"],
      education: "Islamic University of Madinah, Qassim University"
    },
    {
      id: 2,
      name: "Ustadh Al Amin Ahmed",
      image: "/images/t2.png",
      bio: "Ustadh Al Amin Ahmed is currently studying at the Islamic University of Madinah in the faculty of Shari'ah. He studied the Arabic Language abroad in Morocco and Egypt, and has a certificate in Arabic Language & Translation from the University of New York. He has many years of teaching experience in Arabic Language and Islamic Sciences. Ustadh Al Amin is a software consultant by profession and holds a Masters degree in Computer Science from the University of Illinois and a Bachelors degree from Queens College, New York.",
      specializations: ["Arabic Language", "Islamic Sciences", "Translation"],
      education: "Islamic University of Madinah, University of Illinois"
    },
    {
      id: 3,
      name: "Ustadh Abu'Abdissalam",
      image: "/images/t3.png",
      bio: "Ustadh Abu 'Abdissalam has been a part time student for 20+ years. In that time, he has studied the 'Ulum al-Ghayah and 'Ulum al-Alah with senior students and mashayikh privately, in person, and at various online institutes. He has a special interest in Hanbali Fiqh and 'Aqidah and continues to study and read on these topics. Ustadh Abu 'Abdissalam has a passion for teaching and has a number of years of experience teaching privately one on one and to small groups. Professionally, Ustadh Abu 'Abdissalam is an educator with almost 20 years of teaching experience. He has taught classes from grades 1 to grade 12. He holds a Bachelor of Arts in Sociology and a Bachelor of Education.",
      specializations: ["Hanbali Fiqh", "ʿAqidah", "Education"],
      education: "Bachelor of Arts in Sociology, Bachelor of Education"
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Ahmad M.",
      text: "The Fitrah Foundation has transformed my understanding of Islam. The courses are comprehensive and the instructors are truly knowledgeable."
    },
    {
      name: "Fatima S.",
      text: "I appreciate the balance between traditional teachings and modern application. It has helped me connect with my faith on a deeper level."
    },
    {
      name: "Omar K.",
      text: "This is an excellent course taught by Sh. Kamil Ahmad. What I found most beneficial from this course is that he focuses a lot on proper behavior when seeking knowledge, while adding in impactful statements from our righteous scholars of the past and how they viewed seeking knowledge. Alhamdulillah, I felt more confident after I finished the course, having understood the fundamental guidelines to succeed as well as the common pitfalls when seeking knowledge."
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <div className="w-[80%] xl:w-[1400px] mx-auto h-[800px] flex flex-col md:flex-row items-center justify-center md:justify-between">
        {/* Content Container */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-8 md:gap-12 order-2 md:order-1 md:w-1/2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-palanquin-dark mt-4 md:mt-0">
            Step onto the noble path in search of sacred knowledge.
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-accent text-secondary px-6 py-3 shadow-md hover:shadow-lg rounded-full font-medium border-2 border-secondary hover:scale-105 transition-transform cursor-pointer">
              Get Started
            </button>

            <button className="px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg border-2 border-primary text-primary hover:scale-105 transition-transform cursor-pointer">
              Learn More
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="flex justify-center items-center order-1 md:order-2 md:w-1/2 mt-10 md:mt-0">
          <Image
            src="/images/logo.png"
            alt="Sacred Knowledge"
            width={350}
            height={350}
            className="w-64 sm:w-80 md:w-96 lg:w-[350px] mx-auto"
          />
        </div>
      </div>
      
      <div className="flex justify-center items-start">
        <Image src="/images/cali.png" alt="Cali" width={1440} height={100} className="max-md:hidden md:w-[500px]" />
      </div>


      <div className="w-[80%] xl:w-[1400px] mx-auto mt-[100px] p-10 py-8 bg-secondary text-primary text-center border-2 border-primary flex items-center justify-around gap-4 flex-wrap">
        <p className="text-lg font-bold sm:text-base">
          Aqeedah
        </p>
        <p className="text-lg font-bold sm:text-base">
          Fiqh
        </p>
        <p className="text-lg font-bold sm:text-base">
          Hadith
        </p>
        <p className="text-lg font-bold sm:text-base">
          Quran
        </p>
        <p className="text-lg font-bold sm:text-base">
          Arabic
        </p>
      </div>


      <div className="w-[80%] xl:w-[1400px] mx-auto my-[100px] text-primary text-start flex items-center justify-start gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">What is Fitrah Foundation?</h1>
        <p className="text-sm sm:text-base">The Fitrah Foundation strives to reconnect individuals with their innate recognition of Allah and guide them back to their natural disposition. In a world influenced by external factors, the foundation provides education and guidance to dispel confusion and align beliefs and actions with the inherent understanding of right and wrong, fostering a return to moral clarity and truth.</p>
      </div>


      {/*The Teachers Section*/}
      <div className="bg-primary min-h-screen py-20 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border-2 border-secondary rounded-full"></div>
          <div className="absolute top-60 right-20 w-24 h-24 border-2 border-secondary rotate-45"></div>
          <div className="absolute bottom-40 left-1/4 w-16 h-16 border-2 border-secondary rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-20 h-20 border-2 border-secondary rotate-12"></div>
        </div>

        <div className="w-[80%] xl:w-[1400px] mx-auto text-secondary relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-secondary mx-auto mb-4"></div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-secondary bg-clip-text text-transparent">
                LEARN FROM OUR
              </span>
              <br />
              <span className="text-secondary">EXPERIENCED INSTRUCTORS</span>
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
              Study with distinguished scholars who combine traditional Islamic education with modern pedagogical excellence
            </p>
          </div>

          {/* Teachers Grid */}
          <div className="space-y-12">
            {teachers.map((teacher, index) => (
              <div
                key={teacher.id}
                className={`group transition-all duration-700 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                onMouseEnter={() => setHoveredCard(teacher.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="bg-secondary rounded-2xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-all duration-500 border-2 border-amber-200 group-hover:border-amber-300">
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Section */}
                    <div className={`lg:w-1/3 relative overflow-hidden ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="h-64 lg:h-full bg-primary flex items-center justify-center relative">
                        <div className="w-32 h-32 lg:w-64 lg:h-64 relative rounded-full overflow-hidden shadow-lg">
                          <Image
                            src={teacher.image} // e.g., "/images/t1.png"
                            alt={teacher.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-2 border-secondary rounded-full opacity-30"></div>
                        <div className="absolute bottom-6 right-6 w-6 h-6 border-2 border-secondary rotate-45 opacity-30"></div>

                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent transition-opacity duration-300 ${
                          hoveredCard === teacher.id ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="text-secondary text-sm font-medium mb-1">Education</div>
                            <div className="text-secondary text-xs">{teacher.education}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`lg:w-2/3 p-8 lg:p-12 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <div className="space-y-6">
                        {/* Name and Title */}
                        <div>
                          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                            {teacher.name}
                          </h2>
                          <div className="w-20 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2">
                          {teacher.specializations.map((spec, specIndex) => (
                            <span
                              key={specIndex}
                              className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-200 text-primary text-sm font-medium rounded-full border border-emerald-300"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Bio */}
                        <div className="space-y-4">
                          <p className="text-primary leading-relaxed text-sm lg:text-base">
                            {teacher.bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/*Testimonials Section*/}
      <div className="h-[50%] w-[80%] xl:w-[1400px] mx-auto my-[100px] text-primary text-start">
        <h1 className="text-2xl text-center font-bold mb-20">What Our Students Say</h1>
        
        {/* Testimonial Container */}
        <div className="relative flex items-center justify-between gap-4 mb-8 text-center">
          {/* Left Arrow */}
          <button
            onClick={prevTestimonial}
            className="p-2 bg-accent text-amber-100 rounded-full hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 flex-shrink-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Testimonial Content */}
          <div className="flex-1 px-4">
            <h3 className="text-lg font-semibold mb-3 text-primary">
              {testimonials[currentTestimonial].name}
            </h3>
            <p className="text-sm sm:text-base text-primary leading-relaxed">
              &quot;{testimonials[currentTestimonial].text}&quot;
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextTestimonial}
            className="p-2 bg-accent text-amber-100 rounded-full hover:bg-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 flex-shrink-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicator Dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-primary'
                  : 'bg-accent hover:bg-primary'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>


      {/* Call to Action */}
      <div className=" w-[80%] xl:w-[1400px] mx-auto text-center mt-20 pt-16 border-t border-primary">
        <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-4">
          Ready to Begin Your Islamic Learning Journey?
        </h3>
        <p className="text-primary mb-8 max-w-2xl mx-auto">
          Join thousands of students worldwide who have transformed their understanding of Islam through our comprehensive programs
        </p>
        <button className="px-8 py-4 bg-accent text-secondary font-bold text-lg rounded-4xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 border-2 border-secondary">
          Enroll Today
        </button>
      </div>
    </div>
  );
}