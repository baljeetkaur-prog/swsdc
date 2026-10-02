"use client";

import { useEffect, useRef, useState } from "react";
import "./Figures.css";

const figures = [
  {
    value: 1000,
    display: "1K",
    title: "Students Trained",
  },
  {
    value: 5,
    display: "5",
    title: "Expert Trainers",
  },
  {
    value: 40,
    display: "40",
    title: "Hours of Practical Training",
  },
  {
    value: 5,
    display: "5",
    title: "Welding Courses",
  },
  {
    value: 1000,
    display: "1K+",
    title: "Successful Learners",
  },
];

const Figures = () => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(1000 * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [started]);

  const getDisplayValue = (index: number) => {
    const target = figures[index].value;

    if (!started) {
      return index === 1 || index === 3 ? "0" : "0";
    }

    if (target === 1000) {
      return count >= 1000 ? figures[index].display : count;
    }

    return Math.min(
      Math.floor((count / 1000) * target),
      target
    );
  };

  return (
    <section className="figures-section" ref={sectionRef}>
      <div className="figures-container">
        {figures.map((figure, index) => (
          <div className="figure-item" key={figure.title}>
            <div className="figure-number">
              {getDisplayValue(index)}
            </div>

            <h3>{figure.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Figures;