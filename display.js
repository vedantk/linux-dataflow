var w = 6000
    , h = 4800
    , cw = w / 2.0
    , ch = h / 2.0
    , radius = Math.min(w, h) / 2.45
    , theta = 0.0
    , theta_step = (2 * Math.PI) / nr_subsys
    , paper = Raphael(0, 0, w, h)
    ;

var add_subsystem = function(name, defs) {
  var frac = 0.80 * Math.log(Math.log(defs.length))
    , x = cw + (radius * Math.cos(theta))
    , y = ch + (radius * Math.sin(theta))
    , cradius = frac * 135
    , circle = paper.circle(x, y, cradius)
    , color = Raphael.hsb(theta / (2 * Math.PI), 0.65, 0.85)
    , label = paper.text(x, y, name)
    , oradius = cradius + 80
    , nboxes = 8
    , phi = Math.PI / nboxes
    , phi_step = (2 * Math.PI) / nboxes
    ;

  /* Create a circle for the subsystem. */
  circle.attr('fill', color);
  label.attr('fill', '#eee');
  label.attr('href', 'http://lxr.free-electrons.com/source/' + name);
  label.attr('font-family', 'monospace');
  label.attr('font-size', '42px');
  theta = theta + theta_step;

  /* Collect popular structs and arrange them around the circle. */
  for (var i = 0; i < nboxes; i++) {
    var bw = 134
      , bh = 36
      , bx = (x + (oradius * Math.cos(phi))) - (bw / 2)
      , by = (y + (oradius * Math.sin(phi))) - (bh / 2)
      , box = paper.rect(bx, by, bw, bh, 10)
      , structname = defs[i][0]
      , struct = paper.text(bx + (bw / 2), by + (bh / 2), structname)
      ;

    if (struct.getBBox().width > (7.0 * bw / 12.0)) {
      nboxes = nboxes + 1;
      box.remove();
      struct.remove();
      continue;
    }

    box.attr('fill', color);
    struct.attr('font-family', 'monospace');
    struct.attr('font-size', '12px');
    struct.attr('fill', '#eee');
    struct.attr('href', 'http://lxr.free-electrons.com/ident?i=' + structname);

    for (var j = 0; j < 3; j++) {
      /* Draw edges to the subsystems making the most use of this struct. */
    }

    phi = phi + phi_step;
  }
};

/* Create a background circle. */
var meta = paper.circle(cw, ch, radius)
  , label = paper.text(cw, ch, 'Linux')
  ;

meta.attr('fill', '#eee');
label.attr('href', 'https://www.kernel.org/');
label.attr('font-family', 'monospace');
label.attr('font-size', '200px');

for (subsys in data) {
  add_subsystem(subsys, data[subsys]);
}

/* Log the source. */
console.log(data);
