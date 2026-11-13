/* @ds-bundle: {"format":4,"namespace":"AR4","components":[{"name":"Shell"},{"name":"AppHeader"},{"name":"NavTabs"},{"name":"EStop"},{"name":"StatusChip"},{"name":"Notice"},{"name":"Panel"},{"name":"Button"},{"name":"Segmented"},{"name":"Input"},{"name":"Select"},{"name":"Checkbox"},{"name":"Slider"},{"name":"RangeBar"},{"name":"JointRow"},{"name":"Readout"},{"name":"Table"},{"name":"Stages"},{"name":"SaveBar"},{"name":"CameraView"},{"name":"LogView"},{"name":"Icon"}]} */
(function () {
  var R = window.React, h = R.createElement, useState = R.useState;
  var MINUS = "−";

  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
  function isNum(v) { return typeof v === "number" && isFinite(v); }
  function fmt(v, digits) {
    if (!isNum(v)) return "—";
    var s = Math.abs(v).toFixed(digits == null ? 1 : digits);
    return (v < 0 ? MINUS : "") + s;
  }
  function useControlled(value, defaultValue, onChange) {
    var st = useState(defaultValue);
    var controlled = value !== undefined;
    return [controlled ? value : st[0], function (v) { if (!controlled) st[1](v); if (onChange) onChange(v); }];
  }
  function omit(o, keys) { var r = {}; for (var k in o) if (keys.indexOf(k) < 0) r[k] = o[k]; return r; }

  /* ---------- Icon ---------- */
  var PATHS = {
    minus: "M5 12h14",
    plus: "M12 5v14M5 12h14",
    expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
    chevron: "M6 9l6 6 6-6",
    play: "M8 5l11 7-11 7z",
    pause: "M8 5v14M16 5v14",
    download: "M12 4v11M7 10l5 5 5-5M5 20h14",
    trash: "M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",
    link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    home: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
    gripper: "M7 4v6l3 3v7M17 4v6l-3 3v7"
  };
  function Icon(p) {
    var name = p.name || "plus";
    if (name === "stop") {
      return h("svg", { viewBox: "0 0 24 24", className: p.className, "aria-hidden": "true" },
        h("path", { d: "M8 2.5h8l5.5 5.5v8L16 21.5H8L2.5 16V8z", fill: "currentColor" }),
        h("path", { d: "M8 12h8", stroke: "var(--danger-fill)", strokeWidth: 2.5, strokeLinecap: "round" }));
    }
    return h("svg", { viewBox: "0 0 24 24", className: p.className, "aria-hidden": "true", fill: name === "play" ? "currentColor" : "none", stroke: "currentColor", strokeWidth: p.strokeWidth || 2, strokeLinecap: "round", strokeLinejoin: "round" },
      h("path", { d: PATHS[name] || PATHS.plus }));
  }

  /* ---------- Button ---------- */
  function Button(p) {
    var variant = p.variant || "secondary", size = p.size || "md";
    var rest = omit(p, ["variant", "size", "icon", "iconOnly", "children", "className"]);
    return h("button", Object.assign({ type: "button" }, rest, {
      className: cx("ar-btn", "ar-btn--" + variant, size !== "md" && "ar-btn--" + size, p.iconOnly && "ar-btn--icon", p.className)
    }), p.icon ? h(Icon, { name: p.icon }) : null, p.iconOnly ? null : p.children);
  }

  /* ---------- StatusChip ---------- */
  function StatusChip(p) {
    var tone = p.tone || "idle";
    return h("span", { className: cx("ar-chip", "ar-chip--" + tone, p.className), title: p.title },
      h("span", { className: "ar-chip__mark", "aria-hidden": "true" }),
      p.label != null ? h("b", null, p.label) : null,
      p.detail != null ? h("span", null, p.detail) : null);
  }

  /* ---------- AppHeader ---------- */
  function AppHeader(p) {
    return h("header", { className: "ar-header" },
      h("div", { className: "ar-header__brand" }, p.title || "AR4 Console", p.subtitle ? h("small", null, p.subtitle) : null),
      p.nav || null,
      h("div", { className: "ar-header__status" }, (p.statuses || []).map(function (s, i) { return h(StatusChip, Object.assign({ key: i }, s)); })),
      h("div", { className: "ar-header__actions" }, p.actions));
  }

  /* ---------- NavTabs ---------- */
  function NavTabs(p) {
    var items = p.items || [];
    var c = useControlled(p.value, p.defaultValue || (items[0] && items[0].id), p.onChange);
    return h("nav", { className: "ar-tabs", "aria-label": "Разделы" }, items.map(function (it, i) {
      return h("button", { key: it.id, type: "button", className: "ar-tab", "aria-current": c[0] === it.id ? "page" : undefined, title: "Клавиша " + (it.key || i + 1), onClick: function () { c[1](it.id); } },
        h("span", null, it.label),
        it.warn ? h("span", { className: "ar-tab__warn", role: "img", "aria-label": typeof it.warn === "string" ? it.warn : "требует внимания" }) : null,
        it.count != null ? h("span", { className: "ar-tab__count" }, it.count) : null);
    }));
  }

  /* ---------- Panel ---------- */
  function Panel(p) {
    return h("section", { className: cx("ar-panel", p.tone && "ar-panel--" + p.tone, p.className), style: p.style },
      (p.title || p.actions) ? h("div", { className: "ar-panel__head" },
        p.title ? h("h2", { className: "ar-panel__title" }, p.title) : null,
        p.meta ? h("span", { className: "ar-panel__meta" }, p.meta) : null,
        p.actions ? h("div", { className: "ar-panel__actions" }, p.actions) : null) : null,
      h("div", { className: cx("ar-panel__body", p.flush && "ar-panel__body--flush") }, p.children),
      p.footer || null);
  }

  /* ---------- Segmented ---------- */
  function Segmented(p) {
    var opts = (p.options || []).map(function (o) { return typeof o === "object" ? o : { value: o, label: String(o) }; });
    var c = useControlled(p.value, p.defaultValue !== undefined ? p.defaultValue : (opts[0] && opts[0].value), p.onChange);
    var seg = h("div", { className: cx("ar-seg", p.mono && "ar-seg--mono", p.className), role: "group", "aria-label": p.label },
      opts.map(function (o) {
        return h("button", { key: String(o.value), type: "button", className: "ar-seg__opt", disabled: p.disabled || o.disabled, "aria-pressed": c[0] === o.value ? "true" : "false", onClick: function () { c[1](o.value); } }, o.label);
      }));
    if (!p.label || p.hideLabel) return seg;
    return h("div", { className: "ar-field-inline" }, h("span", { className: "ar-label" }, p.label), seg);
  }

  /* ---------- Input / Select / Checkbox ---------- */
  function Input(p) {
    var rest = omit(p, ["suffix", "size", "dirty", "invalid", "label", "className", "style", "width"]);
    var box = h("label", { className: cx("ar-input", p.size === "sm" && "ar-input--sm", p.dirty && "ar-input--dirty", p.invalid && "ar-input--invalid", p.className), "aria-disabled": p.disabled ? "true" : undefined, style: Object.assign({ width: p.width }, p.style) },
      h("input", Object.assign({ type: "text", inputMode: "decimal" }, rest)),
      p.suffix ? h("span", { className: "ar-input__suffix" }, p.suffix) : null);
    if (!p.label) return box;
    return h("div", { className: "ar-field" }, h("span", { className: "ar-label" }, p.label), box);
  }
  function Select(p) {
    var rest = omit(p, ["options", "size", "dirty", "label", "className", "width"]);
    var opts = (p.options || []).map(function (o) { return typeof o === "object" ? o : { value: o, label: String(o) }; });
    var box = h("label", { className: cx("ar-input", p.size === "sm" && "ar-input--sm", p.dirty && "ar-input--dirty", p.className), "aria-disabled": p.disabled ? "true" : undefined, style: { width: p.width } },
      h("select", rest, opts.map(function (o) { return h("option", { key: String(o.value), value: o.value }, o.label); })),
      h(Icon, { name: "chevron", className: "ar-input__chev" }));
    if (!p.label) return box;
    return h("div", { className: "ar-field" }, h("span", { className: "ar-label" }, p.label), box);
  }
  function Checkbox(p) {
    var rest = omit(p, ["label", "className"]);
    return h("label", { className: cx("ar-check", p.className) }, h("input", Object.assign({ type: "checkbox" }, rest)), p.label ? h("span", null, p.label) : null);
  }

  /* ---------- Slider ---------- */
  function Slider(p) {
    var min = p.min == null ? 0 : p.min, max = p.max == null ? 100 : p.max;
    var c = useControlled(p.value, p.defaultValue != null ? p.defaultValue : min, p.onChange);
    var v = c[0], has = isNum(v) && !p.unknown;
    var pct = has ? ((v - min) / (max - min)) * 100 : 0;
    return h("div", { className: cx("ar-slider", !p.label && "ar-slider--nolabel", p.className) },
      p.label ? h("span", { className: "ar-label", style: { width: p.labelWidth || 72 } }, p.label) : null,
      h("input", { type: "range", min: min, max: max, step: p.step || 1, value: has ? v : min, disabled: p.disabled, "aria-label": p.label || p.ariaLabel, style: { "--p": pct + "%" }, onChange: function (e) { c[1](Number(e.target.value)); } }),
      h("span", { className: cx("ar-slider__value", !has && "ar-slider__value--none") }, has ? (p.format ? p.format(v) : v) : "—", has && p.unit ? h("span", { className: "ar-unit" }, p.unit) : null));
  }

  /* ---------- RangeBar ---------- */
  function RangeBar(p) {
    var min = p.min, max = p.max;
    var lo = p.domain ? p.domain[0] : min, hi = p.domain ? p.domain[1] : max;
    var pos = function (v) { return Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100)); };
    var has = isNum(p.value);
    var nearLimit = has && (p.value - min < (max - min) * 0.05 || max - p.value < (max - min) * 0.05);
    var ticks = p.ticks !== false;
    return h("div", { className: cx("ar-range", !has && "ar-range--unknown", p.className), role: "img", "aria-label": "Диапазон " + fmt(min, 0) + "…" + fmt(max, 0) + "°" + (has ? ", сейчас " + fmt(p.value) + "°" : ", положение неизвестно"), style: p.style },
      h("div", { className: "ar-range__track" }),
      h("div", { className: "ar-range__band", style: { left: pos(min) + "%", width: (pos(max) - pos(min)) + "%" } }),
      lo < 0 && hi > 0 ? h("div", { className: "ar-range__zero", style: { left: pos(0) + "%" } }) : null,
      has ? h("div", { className: cx("ar-range__marker", nearLimit && "ar-range__marker--warn"), style: { left: pos(p.value) + "%" } }) : null,
      ticks ? h("div", { className: "ar-range__ticks" },
        h("span", { className: "ar-range__tick", style: { left: pos(min) + "%", transform: pos(min) < 4 ? "none" : undefined } }, fmt(min, 0)),
        h("span", { className: "ar-range__tick", style: { left: pos(max) + "%", transform: pos(max) > 96 ? "translateX(-100%)" : undefined } }, fmt(max, 0))) : null);
  }

  /* ---------- JointRow ---------- */
  function JointRow(p) {
    var has = isNum(p.value);
    return h("div", { className: cx("ar-joint", p.disabled && "ar-joint--disabled") },
      h("span", { className: "ar-joint__name" }, p.joint),
      h("span", { className: cx("ar-joint__angle", !has && "ar-joint__angle--none") }, fmt(p.value, p.digits), has ? h("span", { className: "ar-unit" }, "°") : null),
      h(RangeBar, { min: p.min, max: p.max, value: p.value }),
      h("div", { className: "ar-joint__btns" },
        h(Button, { variant: "secondary", size: "lg", iconOnly: true, icon: "minus", disabled: p.disabled || (has && p.value <= p.min), "aria-label": p.joint + " " + MINUS + (p.step || ""), onClick: function () { p.onStep && p.onStep(-1); } }),
        h(Button, { variant: "secondary", size: "lg", iconOnly: true, icon: "plus", disabled: p.disabled || (has && p.value >= p.max), "aria-label": p.joint + " +" + (p.step || ""), onClick: function () { p.onStep && p.onStep(1); } })));
  }

  /* ---------- Readout ---------- */
  function Readout(p) {
    var has = isNum(p.value) || (typeof p.value === "string" && p.value !== "");
    return h("div", { className: cx("ar-readout", p.size === "sm" && "ar-readout--sm", p.className) },
      h("div", { className: "ar-readout__label" }, p.label),
      h("div", { className: cx("ar-readout__value", !has && "ar-readout__value--none") }, isNum(p.value) ? fmt(p.value, p.digits == null ? 2 : p.digits) : (has ? p.value : "—"), has && p.unit ? h("span", { className: "ar-unit" }, p.unit) : null));
  }
  function Readouts(p) { return h("div", { className: "ar-readouts" }, p.children); }

  /* ---------- Table ---------- */
  function Table(p) {
    var cols = p.columns || [];
    return h("div", { className: "ar-table-wrap" }, h("table", { className: "ar-table" },
      h("thead", null, h("tr", null, cols.map(function (c) {
        return h("th", { key: c.key, className: c.align === "num" || c.align === "end" ? "ar-c-end" : c.align === "center" ? "ar-c-center" : undefined, style: { width: c.width } }, c.hint ? h("abbr", { title: c.hint }, c.label) : c.label);
      }))),
      h("tbody", null, (p.rows || []).map(function (r, i) {
        return h("tr", { key: r.key || i }, cols.map(function (c) {
          return h("td", { key: c.key, className: c.align === "num" ? "ar-c-num" : c.align === "center" ? "ar-c-center" : c.align === "end" ? "ar-c-end" : undefined }, r[c.key]);
        }));
      }))));
  }

  /* ---------- Stages ---------- */
  function Stages(p) {
    var out = [];
    (p.stages || []).forEach(function (s, i) {
      if (i) out.push(h("span", { key: "a" + i, className: "ar-stages__arrow", "aria-hidden": "true" }, "→"));
      out.push(h("div", { key: i, className: cx("ar-stage", s.state && "ar-stage--" + s.state) },
        h("span", { className: "ar-stage__n" }, s.state === "done" ? "✓" : String(i + 1)),
        h("span", { className: "ar-stage__txt" }, h("span", { className: "ar-stage__title" }, s.title), h("span", { className: "ar-stage__joints" }, s.joints)),
        s.status ? h("span", { className: "ar-stage__state" }, s.status) : null));
    });
    return h("div", { className: "ar-stages" }, out);
  }

  /* ---------- Notice ---------- */
  function Notice(p) {
    return h("div", { className: cx("ar-notice", "ar-notice--" + (p.tone || "info"), p.bar && "ar-notice--bar", p.className), role: p.tone === "danger" ? "alert" : "status" },
      h("span", { className: "ar-notice__mark", "aria-hidden": "true" }),
      h("div", { className: "ar-notice__body" }, p.title ? h("b", null, p.title, p.children ? ". " : "") : null, p.children),
      p.action ? h("div", { className: "ar-notice__action" }, p.action) : null);
  }

  /* ---------- SaveBar ---------- */
  function SaveBar(p) {
    var dirty = p.dirty > 0 || p.dirty === true;
    return h("div", { className: cx("ar-savebar", dirty && "ar-savebar--dirty") },
      h("div", { className: "ar-savebar__msg" },
        dirty ? h(StatusChip, { tone: "warn", label: typeof p.dirty === "number" ? "Изменено: " + p.dirty : "Есть изменения" }) : h(StatusChip, { tone: "ok", label: "Сохранено" }),
        h("span", null, dirty ? "Не сохранено в " : "Совпадает с ", h("code", null, p.file || "ARconfig.json"), p.note ? " · " + p.note : "")),
      h(Button, { variant: "ghost", disabled: !dirty, onClick: p.onCancel }, "Отменить"),
      h(Button, { variant: "primary", disabled: !dirty, onClick: p.onSave }, p.saveLabel || "Сохранить"));
  }

  /* ---------- CameraView ---------- */
  function CameraView(p) {
    var cams = p.cameras || ["Камера 1", "Камера 2"];
    var c = useControlled(p.camera, p.defaultCamera !== undefined ? p.defaultCamera : 0, p.onCameraChange);
    var live = !!p.src;
    return h("div", { className: cx("ar-cam", p.className), style: p.style },
      live ? h("img", { src: p.src, alt: cams[c[0]] }) : [h("div", { key: "g", className: "ar-cam__grid" }), h("div", { key: "x", className: "ar-cam__cross" }),
        h("div", { key: "e", className: "ar-cam__empty" }, p.emptyText || "Нет сигнала", h("span", null, p.emptyDetail || "поток не получен"))],
      h("div", { className: "ar-cam__bar" },
        h(Segmented, { options: cams.map(function (n, i) { return { value: i, label: n }; }), value: c[0], onChange: c[1], label: "Камера", hideLabel: true }),
        h("span", { className: cx("ar-cam__chip", !live && "ar-cam__chip--off") }, h("span", { className: "ar-cam__rec" }), live ? (p.meta || "LIVE") : "OFF"),
        h("span", { className: "ar-cam__spacer" }),
        h(Button, { className: "ar-btn--overlay", size: "sm", icon: "expand", onClick: p.onFullscreen }, "На весь экран")));
  }

  /* ---------- LogView ---------- */
  var LVL = { info: "INFO", ok: "OK", warn: "WARN", error: "ERR", tx: "TX", rx: "RX" };
  function LogView(p) {
    var lines = p.lines || [];
    return h("div", { className: cx("ar-log", p.className), style: Object.assign({ height: p.height }, p.style), role: "log", "aria-live": "polite" },
      lines.length === 0 ? h("div", { className: "ar-log__empty" }, p.emptyText || "Сообщений нет") :
        lines.map(function (l, i) {
          var lvl = l.level || "info";
          return h("div", { key: i, className: cx("ar-log__line", "ar-log__line--" + lvl) },
            h("span", { className: "ar-log__t" }, l.t),
            h("span", { className: cx("ar-log__lvl", "ar-log__lvl--" + (lvl === "tx" || lvl === "rx" ? "info" : lvl)) }, LVL[lvl] || lvl.toUpperCase()),
            h("span", { className: "ar-log__msg" }, l.text));
        }));
  }

  /* ---------- EStop ---------- */
  function EStop(p) {
    var engaged = !!p.engaged;
    return h("button", { type: "button", className: cx("ar-estop", engaged && "ar-estop--engaged", p.size === "lg" && "ar-estop--lg", p.className), onClick: p.onClick, "aria-pressed": engaged ? "true" : "false", title: engaged ? "Снять аварийный стоп" : "Аварийный стоп (Пробел)" },
      h(Icon, { name: "stop", className: "ar-estop__icon" }), engaged ? (p.resetLabel || "СБРОС СТОПА") : (p.label || "СТОП"));
  }

  /* ---------- Shell ---------- */
  function Shell(p) {
    return h("div", { className: cx("ar-shell", "ar-root", p.className), style: p.style },
      p.header,
      h("div", { className: "ar-shell__banner" }, p.banner || null),
      h("main", { className: "ar-shell__main" }, p.children));
  }
  function PageHead(p) {
    return h("div", { className: "ar-page-head" }, h("h1", null, p.title), p.subtitle ? h("p", null, p.subtitle) : null, p.actions ? h("div", { className: "ar-page-head__actions" }, p.actions) : null);
  }

  var api = { Shell: Shell, PageHead: PageHead, AppHeader: AppHeader, NavTabs: NavTabs, EStop: EStop, StatusChip: StatusChip, Notice: Notice, Panel: Panel, Button: Button, Segmented: Segmented, Input: Input, Select: Select, Checkbox: Checkbox, Slider: Slider, RangeBar: RangeBar, JointRow: JointRow, Readout: Readout, Readouts: Readouts, Table: Table, Stages: Stages, SaveBar: SaveBar, CameraView: CameraView, LogView: LogView, Icon: Icon, format: fmt };
  window.AR4 = Object.assign(window.AR4 || {}, api);
})();
