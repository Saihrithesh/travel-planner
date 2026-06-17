import React, { useEffect, useRef } from "react";

function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let mouse = { x: null, y: null, active: false };
    let cursor = { x: null, y: null, angle: 0, scale: 1 };
    let particles = [];
    let shockwaves = [];
    let stars = [];
    let time = 0;
    let repulsionTrigger = 0;

    const initStars = () => {
      stars = [];
      const density = Math.floor((canvas.width * canvas.height) / 18000); // responsive density
      const maxStars = Math.min(density, 80);
      for (let i = 0; i < maxStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        stars.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.4 + 0.15
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class ExhaustParticle {
      constructor(x, y, vx, vy, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.alpha = 1;
        this.decay = Math.random() * 0.03 + 0.015;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size *= 0.95;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.7})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class LaunchShockwave {
      constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.radius = 2;
        this.maxRadius = 35;
        this.alpha = 1;
      }

      update() {
        this.radius += 1.8;
        this.alpha = 1 - (this.radius / this.maxRadius);
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.45})`;
        ctx.lineWidth = 1.5;
        
        // Draw an expanding half-circle representing exhaust thrust waves
        ctx.beginPath();
        ctx.arc(0, 5, this.radius, Math.PI * 0.1, Math.PI * 0.9);
        ctx.stroke();
        ctx.restore();
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      if (cursor.x === null) {
        cursor.x = mouse.x;
        cursor.y = mouse.y;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleMouseClick = (e) => {
      // Scale rocket up (boost animation kick)
      cursor.scale = 1.7;

      // Trigger gravitational repulsion
      repulsionTrigger = 25;

      // Spawn a thrust shockwave at the exhaust nozzle position
      const A = cursor.angle;
      const nozzleX = cursor.x - 10 * Math.sin(A);
      const nozzleY = cursor.y + 10 * Math.cos(A);
      shockwaves.push(new LaunchShockwave(nozzleX, nozzleY, A));

      // Emit a heavy burst of particles
      const speedAngle = A - Math.PI / 2;
      for (let i = 0; i < 12; i++) {
        const pAngle = speedAngle + (Math.random() - 0.5) * 0.7;
        const speed = Math.random() * 6 + 3;
        const vx = -Math.cos(pAngle) * speed;
        const vy = -Math.sin(pAngle) * speed;
        particles.push(new ExhaustParticle(nozzleX, nozzleY, vx, vy, Math.random() * 4 + 2));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseClick);

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time++;

      // Ease scaling back to normal
      if (cursor.scale > 1) {
        cursor.scale -= 0.08;
      }

      // 1. Update and Render Ambient Interactive Stars
      stars.forEach((star) => {
        // Star base drift
        star.baseX += star.vx;
        star.baseY += star.vy;

        // Wrap around screen bounds
        if (star.baseX < 0) star.baseX = canvas.width;
        if (star.baseX > canvas.width) star.baseX = 0;
        if (star.baseY < 0) star.baseY = canvas.height;
        if (star.baseY > canvas.height) star.baseY = 0;

        // Gravity interaction with cursor
        let targetX = star.baseX;
        let targetY = star.baseY;

        if (cursor.x !== null && cursor.y !== null && mouse.active) {
          const dx = cursor.x - star.x;
          const dy = cursor.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220) {
            const force = (220 - dist) / 220;
            if (repulsionTrigger > 0) {
              // Click explosion: push stars away rapidly
              const repFactor = (repulsionTrigger / 25) * 8;
              targetX -= (dx / dist) * force * repFactor * 12;
              targetY -= (dy / dist) * force * repFactor * 12;
            } else {
              // Hover attraction: pull stars toward cursor
              targetX += (dx / dist) * force * 4.5;
              targetY += (dy / dist) * force * 4.5;
            }
          }
        }

        // Apply friction/easing back to coordinates
        star.x += (targetX - star.x) * 0.08;
        star.y += (targetY - star.y) * 0.08;

        // Render Star
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (repulsionTrigger > 0) {
        repulsionTrigger--;
      }

      // 2. Physics logic for vector rocket cursor
      if (mouse.x !== null && mouse.y !== null && mouse.active) {
        const dx = mouse.x - cursor.x;
        const dy = mouse.y - cursor.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Smooth follow physics
        cursor.x += dx * 0.18;
        cursor.y += dy * 0.18;

        // Calculate rotation angle matching trajectory
        if (distance > 1.5) {
          const targetAngle = Math.atan2(dy, dx) + Math.PI / 2;
          // Smoothly interpolate angle to prevent visual snapping
          let diff = targetAngle - cursor.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          cursor.angle += diff * 0.25;
        }

        // Spawn trailing exhaust smoke when moving
        if (distance > 2) {
          const A = cursor.angle;
          const nozzleX = cursor.x - 10 * Math.sin(A);
          const nozzleY = cursor.y + 10 * Math.cos(A);
          const speedAngle = A - Math.PI / 2;
          const trailDensity = Math.min(Math.floor(distance * 0.15), 3) || 1;

          for (let i = 0; i < trailDensity; i++) {
            const pAngle = speedAngle + (Math.random() - 0.5) * 0.3;
            const speed = Math.random() * 2 + 1;
            const vx = -Math.cos(pAngle) * speed + (Math.random() - 0.5) * 0.5;
            const vy = -Math.sin(pAngle) * speed + (Math.random() - 0.5) * 0.5;
            particles.push(new ExhaustParticle(nozzleX, nozzleY, vx, vy, Math.random() * 2.5 + 1));
          }
        }
      }

      // Update and Draw exhaust smoke particles
      particles = particles.filter((p) => {
        p.update();
        p.draw();
        return p.alpha > 0;
      });

      // Update and Draw thrust shockwaves
      shockwaves = shockwaves.filter((sw) => {
        sw.update();
        sw.draw();
        return sw.alpha > 0;
      });

      // 3. Draw Vector Rocket
      if (cursor.x !== null && cursor.y !== null && mouse.active) {
        ctx.save();
        ctx.translate(cursor.x, cursor.y);
        ctx.rotate(cursor.angle);
        ctx.scale(cursor.scale, cursor.scale);

        // Rocket shadow/glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 255, 255, 0.4)";

        // Fins (wings)
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(-7, 6);
        ctx.lineTo(-4, -1);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(7, 6);
        ctx.lineTo(4, -1);
        ctx.lineTo(4, 4);
        ctx.closePath();
        ctx.fill();

        // Main Body
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.moveTo(0, -9); // Nose cone
        ctx.bezierCurveTo(3.5, -4.5, 3.5, 4.5, 2.5, 6); // Right side
        ctx.lineTo(-2.5, 6); // Bottom
        ctx.bezierCurveTo(-3.5, 4.5, -3.5, -4.5, 0, -9); // Left side
        ctx.closePath();
        ctx.fill();

        // Window
        ctx.strokeStyle = "rgba(10, 10, 10, 0.9)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -1, 1.8, 0, Math.PI * 2);
        ctx.stroke();

        // Nozzle
        ctx.fillStyle = "rgba(140, 140, 140, 1)";
        ctx.fillRect(-1.2, 6, 2.4, 1.5);

        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] mix-blend-screen"
    />
  );
}

export default CursorTrail;
