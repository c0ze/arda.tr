"""Writes bake.html: one frame (?f=N) of a seamless smoke loop, drawn with the
shader of arda.tr/brand/smoke.js. Usage: make_bake.py <smoke.js> <out.html>"""
import re
import sys

src = open(sys.argv[1], encoding="utf-8").read()
frag = re.search(r"const FRAG = `(.*?)`;", src, re.S).group(1)
vert = re.search(r"const VERT = `(.*?)`;", src, re.S).group(1)

main = frag[frag.index("void main() {"):]
loop_main = """uniform float period;
vec2 field(vec2 q, float tt) {
  float n1 = snoise(q * 2.6 + vec2(0.0, tt * 0.11));
  float n2 = snoise(q * 5.3 + vec2(4.7, tt * 0.17));
  float n3 = snoise(q * 2.1 + vec2(9.3, tt * 0.09));
  return vec2(n1 + 0.45 * n2, 0.7 * n3);
}
void main() {
  float rise = smoothstep(0.08, 0.7, 1.0 - uv.y);
  vec2 q = vec2(uv.x, uv.y * aspect);
  float k = t / period;
  // A seamless loop: blend the field at t with the field one period earlier.
  vec2 f = mix(field(q, t), field(q, t - period), k);
  // Mixing two fields lowers the amplitude mid-loop: keep it even.
  f /= sqrt(k * k + (1.0 - k) * (1.0 - k));
  gl_FragColor = texture2D(tex, uv + f * 0.011 * rise);
}"""
frag = frag.replace(main, loop_main)

html = """<!doctype html><meta charset=utf-8>
<style>html,body{margin:0;background:#000}canvas{display:block}</style>
<canvas id=c width=720 height=1102></canvas>
<script>
const VERT = `__VERT__`;
const FRAG = `__FRAG__`;
const N = 192, FPS = 24, SPEED = 6.0;
const PERIOD = N / FPS * SPEED;
const f = +new URLSearchParams(location.search).get("f") || 0;
const img = new Image();
img.onload = () => {
  const c = document.getElementById("c");
  const gl = c.getContext("webgl", { preserveDrawingBuffer: true });
  const mk = (type, s) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, s);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) document.title = "ERR " + gl.getShaderInfoLog(sh);
    return sh;
  };
  const p = gl.createProgram();
  gl.attachShader(p, mk(gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, mk(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(p, "p");
  gl.enableVertexAttribArray(a);
  gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1f(gl.getUniformLocation(p, "aspect"), 1102 / 720);
  gl.uniform1f(gl.getUniformLocation(p, "period"), PERIOD);
  gl.uniform1f(gl.getUniformLocation(p, "t"), (f / N) * PERIOD);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  document.title = "done";
};
img.src = "plume.png";
</script>
"""
open(sys.argv[2], "w", encoding="utf-8").write(html.replace("__VERT__", vert).replace("__FRAG__", frag))
