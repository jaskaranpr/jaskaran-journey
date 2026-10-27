// The story, one entry per scene in reading order. index.html builds the words on screen from this file.
//   len:   how many screens of scrolling the scene lasts
//   cut:   how it arrives (fade | cut | black | white)
//   mood:  which chord and colour of music plays under it (see sound.js)
//   light: a white scene, so the page chrome turns dark (lightFrom: only from that progress on)
//   beats: what you read, and when. at = [in, out] as fractions of the scene's scroll
//          pos = where it sits (c, top, bottom, tl, tr, bl, br, l, r), size = xl | l | m, ink = dark words on a pale backdrop
window.STORY = [
  {id: 'open', label: 'Start', len: 4.2, cut: 'black', mood: 'intro', beats: [
    {at: [0, .22], pos: 'top', size: 'title', html: '<span class="pa">ਜਸਕਰਨ ਸਿੰਘ</span><span class="name">Jaskaran Singh</span><span class="role">Frontend engineer, Bengaluru</span>'},
    {at: [.27, .47], pos: 'bottom', text: 'I build the screens people use to trade.'},
    {at: [.6, .86], pos: 'r', text: 'This is how I got here.'}]},
  {id: 'village', label: 'Chakar, Punjab', len: 4.2, cut: 'fade', mood: 'village', beats: [
    {at: [.06, .44], pos: 'tl', text: 'I grew up in Chakar, a small village in Punjab, near Jagraon.'},
    {at: [.56, .95], pos: 'tr', text: 'I went to the government school there.'}]},
  {id: 'lamp', label: 'Electronics', len: 3.8, cut: 'black', mood: 'night', beats: [
    {at: [.06, .42], pos: 'tl', text: 'As a kid, I loved electronics and computers.'},
    {at: [.56, .95], pos: 'bl', text: 'I wanted to know how they worked. I cared how they looked, too.'}]},
  {id: 'layers', label: 'Photoshop', len: 4.2, cut: 'white', mood: 'wonder', beats: [
    {at: [.05, .34], pos: 'l', text: 'Design came first. I taught myself Photoshop, one layer at a time.'},
    {at: [.4, .64], pos: 'l', text: 'That’s where my Instagram name comes from: jaskaran.psd'},
    {at: [.72, .96], pos: 'bottom', text: 'Then I tried video editing.'}]},
  {id: 'web', label: 'Class 11', len: 3.8, cut: 'fade', mood: 'wonder', beats: [
    {at: [.05, .38], pos: 'tl', text: 'In class 11, I started learning to build websites from YouTube videos.'},
    {at: [.44, .6], pos: 'top', size: 'xl', text: 'I fell for CSS.'},
    {at: [.64, .95], pos: 'br', text: 'Change one line, and the whole screen changes.'}]},
  {id: 'gallery', label: 'CodePen', len: 4.2, cut: 'black', mood: 'village', beats: [
    {at: [.06, .42], pos: 'top', text: 'I made things just to see if I could.'},
    {at: [.52, .94], pos: 'top', text: 'A phone, a bus, a tree that draws itself.'}]},
  {id: 'masai', label: '2021', len: 3.8, cut: 'white', mood: 'bright', light: true, beats: [
    {at: [.05, .36], pos: 'top', text: 'In 2021, a YouTube ad led me to Masai School.'},
    {at: [.42, .7], pos: 'l', text: 'I built a copy of Instagram that looked just like the real one.'},
    {at: [.74, .96], pos: 'r', text: 'Then one of YouTube.'}]},
  {id: 'city', label: '2022, Peepal Co', len: 4, cut: 'black', mood: 'build', beats: [
    {at: [.08, .44], pos: 'tl', text: 'In 2022, I joined Peepal Co in Bengaluru.'},
    {at: [.54, .94], pos: 'tl', text: 'I started on CoinSwitch, then moved to Lemonn, our stock market app.'}]},
  {id: 'chart', label: 'Lemonn', len: 5, cut: 'fade', mood: 'night', beats: [
    {at: [.05, .3], pos: 'tl', text: 'At Lemonn, I drew our trading charts from scratch, every candle and every line.'},
    {at: [.36, .6], pos: 'tl', text: 'Traders can plan a trade right on the chart, and test the idea on past days first.'},
    {at: [.7, .96], pos: 'top', text: 'Piece by piece, it grew into the chart our traders use every day.'}]},
  {id: 'leap', label: 'The leap', len: 3.4, cut: 'white', mood: 'drop', light: true, beats: [
    {at: [.04, .3], pos: 'c', size: 'xl', text: 'This year, I took a leap.'}]},
  {id: 'zing', label: 'Zing Trade', len: 4, cut: 'white', mood: 'bloom', light: true, beats: [
    {at: [.06, .4], pos: 'top', text: 'I started Zing Trade, a browser extension.'},
    {at: [.48, .94], pos: 'bottom', size: 'm', text: 'It brings our trading strategies into the apps people already use, like Groww, Kite, Upstox and Dhan.'}]},
  {id: 'jassi', label: 'Jassi', len: 4, cut: 'black', mood: 'night', beats: [
    {at: [.06, .44], pos: 'tl', text: 'I also built Jassi, a bot that keeps watch over our app at night.'},
    {at: [.58, .95], pos: 'bl', text: 'When something breaks, it wakes the right person.'}]},
  {id: 'now', label: 'Now', len: 3.8, cut: 'fade', mood: 'bloom', beats: [
    {at: [.06, .4], pos: 'top', text: 'Four years on, I’m a senior engineer.'},
    {at: [.5, .94], pos: 'bottom', text: 'And I’m back on CoinSwitch, where I started, giving it a whole new look.'}]},
  {id: 'home', label: 'Still that kid', len: 3.6, cut: 'fade', mood: 'resolve', lightFrom: .64, beats: [
    {at: [.1, .46], pos: 'top', text: 'I’m still that kid from Chakar.'},
    {at: [.58, .95], pos: 'top', ink: true, text: 'I still want things to look right.'}]},
  {id: 'end', label: 'Say hello', len: 2.2, cut: 'white', mood: 'end', light: true, beats: [
    {at: [.08, 1.2], pos: 'c', size: 'end', html: '<p class="hello">If you’re building something, I’d love to hear from you.</p>' +
      '<a class="mail" href="mailto:jaskaran.psd@gmail.com">jaskaran.psd@gmail.com</a>' +
      '<nav class="links"><a href="https://github.com/jaskaranpr">GitHub</a><a href="https://www.linkedin.com/in/jaskaranpr">LinkedIn</a>' +
      '<a href="https://codepen.io/jaskaranpr">CodePen</a><a href="https://www.instagram.com/jaskaran.psd">Instagram</a></nav>' +
      '<button class="again" type="button">Read it again</button>'}]},
];
