import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  User,
  Briefcase,
  Mail,
  Award,
  GraduationCap,
  Wrench,
} from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   SPACE BACKGROUND
========================================================= */
const SpaceBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let W, H;
    const stars = [];
    const shoots = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars.length = 0;
      for (let i = 0; i < 700; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          radius: Math.random() * 1.4,
          alpha: Math.random(),
          speed: Math.random() * 0.05,
        });
      }
    }

    function createShootingStar() {
      shoots.push({
        x: Math.random() * W,
        y: Math.random() * H * 0.5,
        len: 120 + Math.random() * 120,
        speed: 10 + Math.random() * 8,
        life: 1,
      });
    }

    const interval = setInterval(createShootingStar, 1400);

    function animate() {
      ctx.fillStyle = '#02030a';
      ctx.fillRect(0, 0, W, H);

      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W);
      bg.addColorStop(0, 'rgba(40,60,120,0.08)');
      bg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      stars.forEach((star) => {
        star.alpha += (Math.random() - 0.5) * 0.05;
        if (star.alpha < 0.2) star.alpha = 0.2;
        if (star.alpha > 1) star.alpha = 1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
      });

      for (let i = shoots.length - 1; i >= 0; i--) {
        const s = shoots[i];
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * 0.3);
        gradient.addColorStop(0, `rgba(255,255,255,${s.life})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y - s.len * 0.3);
        ctx.stroke();
        s.x += s.speed;
        s.y += s.speed * 0.3;
        s.life -= 0.01;
        if (s.life <= 0) shoots.splice(i, 1);
      }
      requestAnimationFrame(animate);
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7))] z-[1] pointer-events-none" />
    </>
  );
};

/* =========================================================
   FLUID CURSOR
========================================================= */
const FluidCursor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const particles = [];

    class Particle {
      constructor(x, y, hue) {
        this.x = x; this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 8 + 4;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.hue = hue;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.vx *= 0.97; this.vy *= 0.97;
        this.life -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `hsla(${this.hue},100%,70%,1)`);
        gradient.addColorStop(0.4, `hsla(${this.hue + 40},100%,60%,0.5)`);
        gradient.addColorStop(1, `hsla(${this.hue + 80},100%,50%,0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let hue = 200;
    function createParticles(x, y) {
      for (let i = 0; i < 3; i++) particles.push(new Particle(x, y, hue));
      hue += 2;
    }

    const handleMouseMove = (e) => createParticles(e.clientX, e.clientY);
    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'screen';
      particles.forEach((particle, index) => {
        particle.update(); particle.draw();
        if (particle.life <= 0) particles.splice(index, 1);
      });
      requestAnimationFrame(animate);
    }
    animate();

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-[2] pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.75 }}
    />
  );
};

/* =========================================================
   SECTION LABEL
========================================================= */
const SectionLabel = ({ text, className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <div className="w-8 h-px bg-[#93c5fd]"></div>
    <span className="font-heading text-xs md:text-sm tracking-widest uppercase text-[#93c5fd] font-bold opacity-80">
      {text}
    </span>
  </div>
);

/* =========================================================
   SMOOTH SCROLL HELPER
========================================================= */
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

/* =========================================================
   SUMMARY SECTION
========================================================= */
const Summary = () => {
  const sectionRef = useRef(null);
  const textBlockRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set([textBlockRef.current, imageRef.current], { x: '100vw', y: '100vh', opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 2.5,
          pin: true,
        },
      });
      tl.to(textBlockRef.current, { x: 0, y: 0, opacity: 1, ease: 'none' }, 0);
      tl.to(imageRef.current, { x: 0, y: 0, opacity: 1, ease: 'none' }, 0);
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="summary"
      ref={sectionRef}
      className="relative w-full h-screen flex items-center py-24 px-8 md:px-12 lg:px-16 overflow-hidden bg-transparent z-20"
    >
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 w-full max-w-[1600px] mx-auto z-10">
        <div ref={textBlockRef} className="flex-1 w-full flex flex-col gap-6 will-change-transform">
          <SectionLabel text="Profile" />
          <h2 className="font-heading text-[10vw] lg:text-[6vw] font-bold leading-[0.85] tracking-[-0.03em] text-white uppercase">
            Software<br />
            <span className="text-[#93c5fd]">Developer</span>
          </h2>
          <p className="font-body text-lg md:text-xl text-gray-300 max-w-3xl mt-4 leading-relaxed">
            A software developer with a strong foundation in web technologies and data structures &amp; algorithms,
            passionate about building efficient, user-friendly web applications and intelligent systems.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            {['Python', 'C/C++', 'JavaScript', 'Flask', 'React', 'SQL', 'DSA', 'Machine Learning'].map((skill) => (
              <span key={skill} className="px-4 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-xs font-semibold text-gray-300 tracking-widest uppercase">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div ref={imageRef} className="flex justify-center items-center w-full lg:w-[35%] max-w-[420px] will-change-transform">
          <div className="relative w-full aspect-[4/5] rounded-[40px] border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
            {/* Replaced the text block with the avatar image */}
            <img 
              src="/avatar2.jpg" 
              alt="Apuri Thanuja" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
/* =========================================================
   SKILLS SECTION
========================================================= */
const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          scrub: 2.5,
          pin: true,
        },
      });
      tl.fromTo('.toolkit-header',
        { x: '100vw', y: '100vh', opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'none' }
      ).fromTo('.toolkit-card',
        { x: '100vw', y: '100vh', opacity: 0 },
        { x: 0, y: 0, opacity: 1, stagger: 0.1, ease: 'none' },
        '<0.1'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const TabbedCard = ({ title, content, isAccent }) => (
    <div className="toolkit-card relative mt-8 w-full will-change-transform">
      <div className={`absolute right-0 top-0 -translate-y-full flex items-center gap-3 px-4 py-2 rounded-t-xl z-10 ${isAccent ? 'bg-[#93c5fd]' : 'bg-white/10'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isAccent ? 'bg-[#030305]' : 'bg-white'}`}></div>
        <span className={`font-heading text-xs tracking-widest uppercase font-bold ${isAccent ? 'text-[#030305]' : 'text-white'}`}>
          {title}
        </span>
      </div>
      <div className={`p-6 md:p-8 rounded-xl rounded-tr-none relative z-20 flex flex-col gap-4 border ${isAccent ? 'bg-[#93c5fd]/10 border-[#93c5fd]/30' : 'bg-white/5 border-white/10'} backdrop-blur-md`}>
        <p className={`font-heading text-2xl md:text-3xl lg:text-[38px] font-bold uppercase leading-[0.9] tracking-tight ${isAccent ? 'text-[#93c5fd]' : 'text-white'}`}>
          {content}
        </p>
      </div>
    </div>
  );

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full h-screen flex flex-col justify-center px-8 md:px-12 lg:px-16 overflow-hidden bg-transparent z-20"
    >
      <div className="w-full max-w-[1600px] mx-auto z-10 pt-12">
        <div className="toolkit-header flex items-center gap-4 ml-1 mb-10 will-change-transform">
          <div className="w-12 h-px bg-[#93c5fd]"></div>
          <span className="font-heading text-sm font-bold tracking-widest text-[#93c5fd] uppercase">
            THE TOOLKIT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 w-full items-start">
          <div className="flex flex-col gap-6 w-full">
            <TabbedCard title="LANGUAGES" content="C, C++, Python, JavaScript" isAccent={true} />
            <TabbedCard title="DATABASES" content="SQL, MySQL" />
          </div>
          <div className="flex flex-col gap-6 w-full md:mt-12">
            <TabbedCard title="WEB TECHNOLOGIES" content="HTML, CSS, JavaScript, Flask, React" />
            <TabbedCard title="ML & TOOLS" content="Scikit-learn, XGBoost, SHAP, Streamlit, Git, GitHub" isAccent={true} />
          </div>
          <div className="flex flex-col gap-6 w-full md:mt-24">
            <TabbedCard title="CS FUNDAMENTALS" content="DSA, OOP, DBMS, OS, Computer Networks" />
            <TabbedCard title="SOFT SKILLS" content="Communication, Problem-Solving, Teamwork, Time Management" isAccent={true} />
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   PROJECTS SECTION
========================================================= */
const Projects = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const projects = [
    {
      id: '01',
      title: 'OPTIMIZED ML FRAMEWORK FOR PHISHING URL DETECTION',
      tech: 'PYTHON, SCIKIT-LEARN, XGBOOST, SHAP, STREAMLIT',
      date: '2025',
      description:
        'Developed a machine learning model to detect phishing URLs using extracted URL-based features. Compared Random Forest and XGBoost models, optimized with RandomizedSearchCV. Integrated SHAP for explainable AI and built a Streamlit interface for real-time phishing URL prediction.',
      github: '#',
      live: '#',
    },
    {
      id: '02',
      title: 'COLLEGE EVENTS AND SPORTS HUB',
      tech: 'HTML, CSS, JAVASCRIPT, PYTHON, FLASK',
      date: '2024',
      description:
        'Developed a web-based platform to manage college sports and events with real-time slot availability. Implemented responsive UI and backend services for seamless scheduling, booking, and updates. Enabled dynamic slot booking, event tracking, and real-time data handling using Flask.',
      github: '#',
      live: '#',
    },
  ];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo('.proj-ui-layer',
        { x: 800, y: 800, opacity: 0 },
        {
          x: 0, y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 100%', end: 'top top', scrub: 2 },
        }
      );

      const sharedTimelineText = document.querySelector('.proj-timeline-text');
      const sharedTimelineContainer = document.querySelector('.proj-timeline-container');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=800%',
          scrub: 2,
          pin: true,
          onLeave: () => gsap.to(sharedTimelineContainer, { opacity: 0, duration: 0.3, overwrite: true }),
          onEnterBack: () => {
            sharedTimelineText.textContent = projects[projects.length - 1].date;
            gsap.to(sharedTimelineContainer, { opacity: 1, duration: 0.3, overwrite: true });
          },
          onLeaveBack: () => gsap.to(sharedTimelineContainer, { opacity: 0, duration: 0.3, overwrite: true }),
        },
      });

      projects.forEach((proj, i) => {
        const isLeft = i % 2 === 0;
        const card = cardRefs.current[i];
        const st = i * 1.5;
        gsap.set(card, { scale: 0.1, opacity: 0, left: '50%', top: '50%', xPercent: -50, yPercent: -50 });

        tl.to(card, { scale: 0.6, opacity: 1, left: isLeft ? '35%' : '65%', duration: 1.5, ease: 'sine.inOut' }, st)
          .to(card, {
            scale: 1,
            left: isLeft ? '25%' : '75%',
            duration: 1.5,
            ease: 'none',
            onStart: () => {
              sharedTimelineText.textContent = proj.date;
              gsap.to(sharedTimelineContainer, { opacity: 1, duration: 0.3, overwrite: true });
            },
            onReverseComplete: () => {
              if (i !== 0) sharedTimelineText.textContent = projects[i - 1].date;
            },
          }, st + 1.5)
          .to(card, {
            scale: 2.2,
            opacity: 0,
            left: isLeft ? '5%' : '95%',
            duration: 1.5,
            ease: 'sine.inOut',
            onReverseStart: () => {
              sharedTimelineText.textContent = proj.date;
              gsap.to(sharedTimelineContainer, { opacity: 1, duration: 0.3, overwrite: true });
            },
          }, st + 3);
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [projects.length]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative w-full h-screen bg-transparent overflow-hidden z-20"
    >
      <div className="proj-ui-layer absolute inset-0 w-full h-full bg-transparent z-0 opacity-0">
        <div className="absolute top-12 left-8 md:left-12 z-50 flex items-center gap-4">
          <div className="w-8 h-px bg-[#93c5fd]"></div>
          <span className="font-heading text-lg md:text-xl tracking-widest uppercase text-white font-bold">
            PROJECT WORKS
          </span>
        </div>
      </div>

      <div className="proj-timeline-container absolute top-20 right-8 md:right-16 lg:right-24 z-50 flex items-center gap-4 opacity-0">
        <div className="w-8 h-px bg-[#93c5fd]"></div>
        <span className="proj-timeline-text font-heading text-lg md:text-xl tracking-widest uppercase text-white font-bold"></span>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {projects.map((project) => (
          <div
            key={project.id}
            ref={addToRefs}
            className="absolute w-[80vw] max-w-[550px] bg-[#030a1a] border border-[#93c5fd]/20 rounded-2xl flex flex-col items-start justify-center p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] will-change-transform opacity-0 pointer-events-auto overflow-hidden group backdrop-blur-md"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#93c5fd]"></div>
            <h4 className="font-heading text-3xl md:text-4xl lg:text-[42px] text-white uppercase tracking-tighter leading-[0.85] w-full text-left mb-6 relative z-10 mt-4">
              {project.title}
            </h4>
            <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-md mb-6 relative z-10">
              <span className="font-heading text-xs md:text-sm tracking-widest uppercase text-[#93c5fd] font-bold">
                {project.tech}
              </span>
            </div>
            <p className="font-body text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl w-full text-left mb-10 relative z-10 font-medium">
              {project.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-auto relative z-10">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 font-heading text-base tracking-widest text-[#030305] bg-[#93c5fd] hover:bg-white rounded-lg transition-colors duration-300 uppercase w-full sm:w-1/2 text-center shadow-lg">
                  GitHub Project
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer"
                  className="px-8 py-4 font-heading text-base tracking-widest text-white border-2 border-[#93c5fd]/50 hover:bg-[#93c5fd]/10 rounded-lg transition-colors duration-300 uppercase w-full sm:w-1/2 text-center">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* =========================================================
   CERTIFICATIONS SECTION
========================================================= */
const Certifications = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 2.5,
          pin: true,
        },
      });
      tl.fromTo('.cert-slide-1',
        { x: '100vw', y: '100vh', opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'none' }
      )
      .to('.cert-slide-1', { x: '-100vw', y: '-100vh', opacity: 0, ease: 'none' }, 'swap')
      .fromTo('.cert-slide-2',
        { x: '100vw', y: '100vh', opacity: 0 },
        { x: 0, y: 0, opacity: 1, ease: 'none' }, 'swap'
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const certs = [
    { title: 'Smart Coder – DSA Certification', issuer: 'Smart Interviews', desc: 'Comprehensive certification covering Data Structures and Algorithms with competitive programming fundamentals.', skills: 'DSA, Problem Solving' },
    { title: 'Salesforce Certified Agent Force Specialist', issuer: 'Salesforce', desc: 'Certified specialist in Salesforce Agent Force platform, demonstrating CRM and AI-driven service expertise.', skills: 'Salesforce, CRM, AI' },
    { title: 'Programming in Modern C++', issuer: 'NPTEL', desc: 'Rigorous NPTEL course on modern C++ programming paradigms, templates, and STL.', skills: 'C++, STL, OOP' },
    { title: 'Python Programming', issuer: 'NPTEL', desc: 'NPTEL course covering Python fundamentals, data structures, and application development.', skills: 'Python, Scripting' },
    { title: 'Frontend with JavaScript', issuer: 'TASK', desc: 'Certification in frontend web development using JavaScript, DOM manipulation, and modern UI patterns.', skills: 'HTML, CSS, JavaScript' },
    { title: 'HACKFINITI – 24-Hour Hackathon', issuer: 'BVRIT', desc: 'Participated in a 24-hour hackathon at BVRIT, building a functional product under time constraints.', skills: 'Teamwork, Innovation' },
  ];

  const CertCard = ({ cert }) => (
    <div className="relative group w-full">
      <div className="absolute top-0 left-0 w-full h-full bg-[#93c5fd]/20 rounded-xl translate-x-1.5 translate-y-1.5 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300 z-0"></div>
      <div className="relative w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-xl flex flex-col z-10 p-5 group-hover:-translate-y-1 transition-transform duration-300 shadow-2xl">
        <div className="w-full h-16 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center mb-4">
          <span className="font-heading font-bold text-[#93c5fd] text-xs uppercase tracking-widest text-center px-4">{cert.issuer}</span>
        </div>
        <h4 className="font-heading text-sm md:text-base font-bold text-white uppercase leading-[1.1] mb-2 line-clamp-2">{cert.title}</h4>
        <p className="font-body text-xs text-gray-400 leading-relaxed line-clamp-3 mb-auto">{cert.desc}</p>
        <div className="mt-4">
          <div className="font-heading text-[9px] font-bold text-[#93c5fd] uppercase tracking-widest">{cert.skills}</div>
        </div>
      </div>
    </div>
  );

  const slide1 = certs.slice(0, 3);
  const slide2 = certs.slice(3, 6);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="relative w-full h-screen bg-transparent overflow-hidden z-20"
    >
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
        <div className="cert-slide-1 absolute w-full max-w-[1600px] px-8 md:px-12 lg:px-16 will-change-transform z-20">
          <div className="flex items-center gap-4 ml-1 mb-8">
            <div className="w-12 h-px bg-[#93c5fd]"></div>
            <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-[#93c5fd] uppercase">CERTIFICATIONS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {slide1.map((cert, index) => <CertCard key={index} cert={cert} />)}
          </div>
        </div>

        <div className="cert-slide-2 absolute w-full max-w-[1600px] px-8 md:px-12 lg:px-16 will-change-transform z-10 pt-[52px] md:pt-[60px]">
          <div className="flex items-center gap-4 ml-1 mb-8 opacity-0 pointer-events-none">
            <div className="w-12 h-px bg-[#93c5fd]"></div>
            <span className="font-heading text-lg md:text-xl font-bold tracking-widest text-[#93c5fd] uppercase">CERTIFICATIONS</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {slide2.map((cert, index) => <CertCard key={index} cert={cert} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   EDUCATION SECTION
========================================================= */
const Education = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const educationHistory = [
    { id: 1, institution: 'Krishnaveni Junior College', location: 'Telangana', degree: 'Intermediate', date: '2021 – 2023', gradeType: 'CGPA', grade: '9.49 / 10' },
    { id: 2, institution: 'BV Raju Institute Of Technology', location: 'Narsapur', degree: 'B.Tech – Information Technology', date: 'Aug 2023 – Apr 2027', gradeType: 'CGPA', grade: '8.91 / 10' },
  ];

  useEffect(() => {
    let ctx = gsap.context(() => {
      const scrollWidth = containerRef.current.scrollWidth;

      gsap.fromTo('.edu-ui-layer',
        { x: 800, y: 800, opacity: 0 },
        {
          x: 0, y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 100%', end: 'top top', scrub: 2 },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => '+=' + (scrollWidth - window.innerWidth),
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(containerRef.current, { x: () => -(scrollWidth - window.innerWidth), ease: 'none' }, 0);
      tl.fromTo('.edu-racetrack-stripes',
        { backgroundPosition: '0% 0%' },
        { backgroundPosition: '200% 0%', ease: 'none' },
        0
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="relative w-full h-screen overflow-hidden z-20">
      <div className="edu-ui-layer absolute inset-0 w-full h-full bg-transparent z-10 opacity-0 will-change-transform">
        <div className="absolute top-0 left-0 w-full h-[30vh] flex items-center justify-center p-8 z-10 pointer-events-none">
          <h2 className="text-[12vw] font-heading font-bold text-white leading-none tracking-tighter uppercase opacity-5">Academic Track</h2>
        </div>

        <div className="relative w-full h-full flex flex-col justify-end">
          <div className="edu-racetrack-stripes absolute bottom-0 left-0 w-[1000vw] h-20 opacity-20 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #93c5fd, #93c5fd 20px, transparent 20px, transparent 40px, white 40px, white 60px, transparent 60px, transparent 80px)' }}
          ></div>

          <div ref={containerRef} className="w-fit flex items-end h-screen pb-32 pl-[20vw] pr-[20vw] will-change-transform">
            {educationHistory.map((edu) => (
              <div key={edu.id} className="w-[80vw] lg:w-[45vw] flex-shrink-0 px-8 lg:px-12 flex flex-col gap-6 relative">
                <div className="absolute -bottom-32 left-8 lg:left-12 w-10 h-10 rounded-full bg-[#93c5fd] border-8 border-[#030305] z-20"></div>

                <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-white/10 pb-2">
                  <h3 className="text-3xl lg:text-4xl font-heading font-bold text-white uppercase tracking-tight">{edu.institution}</h3>
                  <span className="text-gray-500 font-body text-sm mt-1 md:mt-0 whitespace-nowrap">{edu.location}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <p className="text-xl lg:text-2xl font-body text-[#93c5fd] uppercase tracking-wide">{edu.degree}</p>
                  <span className="text-xs font-body tracking-widest text-gray-400 px-3 py-1 border border-white/10 uppercase whitespace-nowrap">{edu.date}</span>
                </div>

                <div className="mt-4 p-5 bg-white/5 border border-white/10 border-l-4 border-l-[#93c5fd] w-fit backdrop-blur-md">
                  <span className="font-body text-xs font-bold text-gray-400 tracking-widest uppercase">Achieved {edu.gradeType}: </span>
                  <span className="font-heading text-4xl lg:text-5xl font-bold text-white leading-none ml-4 align-middle">{edu.grade}</span>
                </div>
              </div>
            ))}

            <div className="w-[50vw] flex-shrink-0 flex items-end">
              <h4 className="text-[20vw] font-heading text-white opacity-5 tracking-tighter -mb-8">FINISH</h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   CONTACT SECTION
========================================================= */
const Contact = () => {
  const email = 'thanujaapuri@gmail.com';
  const phone = '+91 9398648154';

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen flex flex-col justify-center px-8 md:px-12 lg:px-20 py-16 z-20 bg-transparent"
    >
      <div className="w-full max-w-[1600px] mx-auto z-10">
        <div className="flex flex-col gap-2 mb-10 md:mb-16">
          <SectionLabel text="Let's Collaborate" />
          <h2 className="font-heading text-[3.5rem] md:text-[5.5rem] lg:text-[6.5rem] text-white leading-[0.85] tracking-[-0.04em] uppercase font-bold mt-3">
            GET <span className="text-[#93c5fd]">IN TOUCH.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-10">
          <div className="lg:col-span-6 flex flex-col justify-center gap-12">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-[#93c5fd] mt-2 flex-shrink-0"></div>
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-widest text-white uppercase">Contact Details</span>
            </div>

            <div className="flex flex-col gap-12 pl-8">
              <div className="flex flex-col gap-3">
                <span className="font-body text-sm font-bold tracking-widest text-gray-500 uppercase">Email /</span>
                <a href={`mailto:${email}`} className="font-heading text-xl md:text-2xl lg:text-3xl text-white hover:text-[#93c5fd] transition-colors break-all leading-none">
                  {email}
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <span className="font-body text-sm font-bold tracking-widest text-gray-500 uppercase">Phone /</span>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-heading text-xl md:text-2xl lg:text-3xl text-white hover:text-[#93c5fd] transition-colors leading-none">
                  {phone}
                </a>
              </div>

              <div className="flex gap-12 pt-4">
                <a href="https://linkedin.com/in/thanuja-apuri" target="_blank" rel="noopener noreferrer"
                  className="font-heading text-lg font-bold text-[#93c5fd] uppercase tracking-widest hover:text-white transition-colors border-b-2 border-transparent hover:border-white">
                  LinkedIn ↗
                </a>
                <a href="https://github.com/thanuja1906" target="_blank" rel="noopener noreferrer"
                  className="font-heading text-lg font-bold text-[#93c5fd] uppercase tracking-widest hover:text-white transition-colors border-b-2 border-transparent hover:border-white">
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/5 border border-white/10 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-2xl self-center">
            {/* --- UPDATE THIS LINE BELOW --- */}
            <form action="https://formspree.io/f/mqejeegq" method="POST" className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 border-b border-white/10 pb-1 focus-within:border-[#93c5fd] transition-colors">
                  <label className="font-heading text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
                  <input type="text" name="name" required className="bg-transparent border-none outline-none text-white font-body text-base py-1 placeholder-gray-600" placeholder="Your Name" />
                </div>
                <div className="flex flex-col gap-2 border-b border-white/10 pb-1 focus-within:border-[#93c5fd] transition-colors">
                  <label className="font-heading text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                  <input type="email" name="email" required className="bg-transparent border-none outline-none text-white font-body text-base py-1 placeholder-gray-600" placeholder="Your Email" />
                </div>
              </div>
              <div className="flex flex-col gap-2 border-b border-white/10 pb-1 focus-within:border-[#93c5fd] transition-colors">
                <label className="font-heading text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</label>
                <textarea name="message" required rows="3" className="bg-transparent border-none outline-none text-white font-body text-base py-1 resize-none placeholder-gray-600" placeholder="How can I help?" />
              </div>
              <button type="submit" className="w-full md:w-max px-12 py-4 bg-[#93c5fd] text-[#030305] font-heading font-bold uppercase tracking-widest text-xs transition-all hover:bg-white mt-4 rounded">
                Send Message —
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
/* =========================================================
   MAIN PORTFOLIO
========================================================= */
const Portfolio = () => {
  const navItems = [
    { id: 'hero',           icon: <Home size={20} />,           label: 'Home' },
    { id: 'summary',        icon: <User size={20} />,           label: 'About' },
    { id: 'skills',         icon: <Wrench size={20} />,         label: 'Skills' },
    { id: 'projects',       icon: <Briefcase size={20} />,      label: 'Projects' },
    { id: 'certifications', icon: <Award size={20} />,          label: 'Certifications' },
    { id: 'education',      icon: <GraduationCap size={20} />,  label: 'Education' },
    { id: 'contact',        icon: <Mail size={20} />,           label: 'Contact' },
  ];

  const handleNav = (id) => {
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollTo(id);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#000005] text-white font-sans">

      {/* Global space background */}
      <SpaceBackground />
      <FluidCursor />

      {/* ── HERO SECTION ── */}
      <main id="hero" className="relative flex flex-col items-center justify-start min-h-screen pt-12 z-20">

        {/* Social links — top-left, hero only */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-50"
        >
          <a href="https://github.com/thanuja1906" target="_blank" rel="noreferrer"
            className="w-11 h-11 bg-[#93c5fd] rounded-[14px] flex items-center justify-center text-[#030305] hover:scale-110 transition-transform">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com/in/thanuja-apuri" target="_blank" rel="noreferrer"
            className="w-11 h-11 bg-[#93c5fd] rounded-[14px] flex items-center justify-center text-[#030305] hover:scale-110 transition-transform">
            <FaLinkedinIn size={20} />
          </a>
          <a href="mailto:thanujaapuri@gmail.com"
            className="w-11 h-11 bg-[#93c5fd] rounded-[14px] flex items-center justify-center text-[#030305] hover:scale-110 transition-transform">
            <Mail size={18} />
          </a>
          <div className="w-[1px] h-20 bg-white/10 mt-2" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-1.5 border border-white/10 rounded-full bg-white/5 backdrop-blur-md mb-6 tracking-[0.3em] text-[10px] uppercase font-semibold text-gray-300"
        >
          Innovative
        </motion.div>

        {/* Hero headline — static, no typed animation */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-[7rem] font-black tracking-tight leading-none text-center relative z-30 -mt-4"
          style={{ textShadow: '0 0 20px rgba(147,197,253,0.15)' }}
        >
          <span className="text-[#93c5fd]">SOFTWARE </span>
          <span className="inline-block">ENGINEER</span>
        </motion.h1>

        {/* Avatar */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20">
          <div className="relative w-[34vw] max-w-[430px] min-w-[260px] pointer-events-none">
            <img src="/avatar.jpg" alt="avatar" draggable="false"
              className="w-full h-full object-contain object-bottom opacity-100 select-none drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]" />
          </div>
        </div>

        {/* Resume widget */}
        <div className="absolute bottom-10 left-10 z-50 flex items-end gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10 bg-[#0b1118] shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-xl">
            <img src="/avatar.jpg" alt="avatar" className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/resume.pdf';
                link.download = 'Apuri_Thanuja_Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="relative px-10 py-5 rounded-[100px] border border-[#93c5fd]/50 bg-[#081018]/80 backdrop-blur-xl text-white text-2xl font-black tracking-wide hover:scale-105 hover:border-[#93c5fd] transition-all duration-300 shadow-[0_0_30px_rgba(147,197,253,0.12)]"
              style={{ minWidth: '240px' }}
            >
              RESUME
              <div className="absolute inset-0 rounded-[100px] bg-[#93c5fd]/5 blur-2xl -z-10" />
            </button>
            <div className="mt-2 flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-[#93c5fd]/50" />
              <div className="w-2 h-2 rounded-full bg-[#93c5fd]/35" />
            </div>
          </div>
        </div>
      </main>

      {/* ── BOTTOM NAV — all sections with tooltips ── */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex items-center gap-8 z-50 shadow-2xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            title={item.label}
            className="group relative flex flex-col items-center text-gray-500 hover:text-[#93c5fd] transition-all duration-200"
          >
            {item.icon}
            {/* Tooltip */}
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0b1524] border border-white/10 rounded text-[10px] font-heading tracking-widest uppercase text-[#93c5fd] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* ── ALL SECTIONS ── */}
      <Summary />
      <Skills />
      <Projects />
      <Certifications />
      <Education />
      <Contact />

    </div>
  );
};

export default Portfolio;