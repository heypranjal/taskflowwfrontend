// Self-contained HTML/JS particle-sphere effect, rendered inside the sandboxed
// iframe by <RecursiveErosionBackground/>. No external CDN — canvas 2D only.
// The wrapper's isolation script looks for #stage and reparents it as the
// background layer.
export const recursiveErosionSource = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    html, body { margin: 0; padding: 0; height: 100%; background: #0a0908; overflow: hidden; }
    #stage { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  <canvas id="stage"></canvas>
  <script>
    (function () {
      var canvas = document.getElementById('stage');
      var ctx = canvas.getContext('2d');
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = 0, h = 0, cx = 0, cy = 0, R = 0;
      var mode = document.documentElement.dataset.sfMode || 'dark';

      // Density scales with viewport; capped for phones.
      function pickParticleCount() {
        var area = window.innerWidth * window.innerHeight;
        if (area < 300000) return 900;   // small phones
        if (area < 700000) return 1400;  // tablets / small laptops
        return 2000;                     // desktops
      }
      var N = pickParticleCount();

      // Fibonacci-lattice points on unit sphere.
      var pts = new Array(N);
      var GA = Math.PI * (Math.sqrt(5) - 1);
      for (var i = 0; i < N; i++) {
        var y = 1 - (i / (N - 1)) * 2;
        var r = Math.sqrt(1 - y * y);
        var theta = GA * i;
        pts[i] = {
          x: Math.cos(theta) * r,
          y: y,
          z: Math.sin(theta) * r,
          seed: Math.random()
        };
      }

      function resize() {
        var rect = canvas.getBoundingClientRect();
        w = Math.max(1, rect.width || window.innerWidth);
        h = Math.max(1, rect.height || window.innerHeight);
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = w / 2;
        cy = h / 2;
        R = Math.min(w, h) * 0.36;
      }

      var t = 0;
      var mx = 0, my = 0, tmx = 0, tmy = 0;

      window.addEventListener('pointermove', function (e) {
        tmx = (e.clientX / window.innerWidth - 0.5) * 0.55;
        tmy = (e.clientY / window.innerHeight - 0.5) * 0.35;
      }, { passive: true });

      window.addEventListener('resize', resize);
      resize();

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var speed = reduced ? 0.0015 : 0.005;
      var rotSpeed = reduced ? 0.05 : 0.28;

      // Color palettes.
      var isDark = mode !== 'light';
      var fadeColor = isDark ? 'rgba(10, 9, 8, 0.18)' : 'rgba(244, 243, 241, 0.22)';
      var dotBase = isDark ? [255, 244, 224] : [30, 24, 20];
      var haloColor = isDark ? 'rgba(255, 210, 150, 0.06)' : 'rgba(90, 60, 30, 0.04)';

      // Reusable projected buffer to avoid per-frame allocation.
      var proj = new Array(N);
      for (var k = 0; k < N; k++) proj[k] = { x: 0, y: 0, z: 0, e: 0 };
      var idx = new Array(N);
      for (var k2 = 0; k2 < N; k2++) idx[k2] = k2;

      function frame() {
        t += speed;
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;

        // Persistence-of-vision trail (dark on dark → luminous streaks).
        ctx.fillStyle = fadeColor;
        ctx.fillRect(0, 0, w, h);

        // Soft halo behind the sphere.
        var g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.4);
        g.addColorStop(0, haloColor);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        var rotY = t * rotSpeed + mx;
        var rotX = my * 0.6;
        var cY = Math.cos(rotY), sY = Math.sin(rotY);
        var cX = Math.cos(rotX), sX = Math.sin(rotX);

        for (var i = 0; i < N; i++) {
          var p = pts[i];
          // Rotate around Y then X.
          var x1 = p.x * cY - p.z * sY;
          var z1 = p.x * sY + p.z * cY;
          var y1 = p.y * cX - z1 * sX;
          var z2 = p.y * sX + z1 * cX;

          // "Recursive erosion" — multiple noise sines that carve density.
          var e = Math.sin(t * 1.4 + p.seed * 6.283 + p.y * 3.2) * 0.5 + 0.5;
          e *= (Math.sin(t * 0.6 + p.x * 4.1) * 0.35 + 0.65);
          e *= (Math.cos(t * 0.9 + p.z * 5.7 + p.seed * 3.14) * 0.25 + 0.75);
          if (e < 0.08) e = 0;

          var q = proj[i];
          q.x = x1 * R + cx;
          q.y = y1 * R + cy;
          q.z = z2;
          q.e = e;
        }

        // Painter's algorithm — back to front.
        idx.sort(function (a, b) { return proj[a].z - proj[b].z; });

        for (var j = 0; j < N; j++) {
          var q2 = proj[idx[j]];
          if (q2.e === 0) continue;
          var depth = (q2.z + 1) * 0.5;         // 0 (back) → 1 (front)
          var a = depth * q2.e * 0.9;
          if (a < 0.02) continue;
          var s = 0.6 + depth * 2.1 * q2.e;
          ctx.fillStyle = 'rgba(' + dotBase[0] + ',' + dotBase[1] + ',' + dotBase[2] + ',' + a + ')';
          ctx.beginPath();
          ctx.arc(q2.x, q2.y, s, 0, 6.2832);
          ctx.fill();
        }

        requestAnimationFrame(frame);
      }

      // Pause when tab is hidden.
      var running = true;
      document.addEventListener('visibilitychange', function () {
        if (document.hidden && running) { running = false; }
        else if (!document.hidden && !running) { running = true; requestAnimationFrame(frame); }
      });

      requestAnimationFrame(frame);
    })();
  </script>
</body>
</html>`;
