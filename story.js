// The film's script, one entry per scene in playing order.
// index.html builds the captions from it; tools/build-film.mjs turns it into the voice, the music and timeline.js.
//   cut:   how the scene arrives (fade | cut | black | white)
//   mood:  music cue for the scene
//   hold:  [seconds before the first line, seconds after the last line]
//   say:   what the voice reads, when it differs from the caption
window.STORY = [
  {id: 'open', label: 'Start', cut: 'black', mood: 'intro', hold: [3.4, 2.2], lines: [
    {text: 'My name is Jaskaran Singh.'},
    {text: 'I build the screens people use to trade.'},
    {text: 'This is how I got here.'}]},
  {id: 'village', label: 'Chakar, Punjab', cut: 'fade', mood: 'intro', lines: [
    {text: 'I grew up in Chakar, a small village in Punjab.'},
    {text: 'I went to the government school there.'}]},
  {id: 'curious', label: 'Electronics', cut: 'fade', mood: 'wonder', lines: [
    {text: 'As a kid, I loved electronics and computers.'},
    {text: 'I wanted to know how they worked, and I cared about how they looked.'}]},
  {id: 'layers', label: 'Photoshop', cut: 'cut', mood: 'pulse', lines: [
    {text: 'Design came first. I taught myself Photoshop, one layer at a time.'},
    {text: 'That’s where my Instagram name comes from: jaskaran.psd', say: 'That’s where my Instagram name comes from. Jaskaran dot P S D.'}]},
  {id: 'edit', label: 'Video editing', cut: 'cut', mood: 'pulse', lines: [
    {text: 'Then I tried video editing.'},
    {text: 'Somewhere along the way, I found the web.'}]},
  {id: 'css', label: 'Class 11', cut: 'fade', mood: 'pulse', lines: [
    {text: 'In class 11, I started learning to build websites from YouTube videos.', say: 'In class eleven, I started learning to build websites from YouTube videos.'},
    {text: 'I fell for CSS. Change one line, and the whole screen changes.', say: 'I fell for C S S. Change one line, and the whole screen changes.'}]},
  {id: 'gallery', label: 'CodePen', cut: 'black', mood: 'lift', lines: [
    {text: 'I made things just to see if I could.'},
    {text: 'A phone, a bus, a tree that draws itself.'}]},
  {id: 'masai', label: '2021', cut: 'white', mood: 'lift', lines: [
    {text: 'In 2021, a YouTube ad led me to Masai School.', say: 'In twenty twenty one, a YouTube ad led me to Masai School.'},
    {text: 'I built a copy of Instagram that looked just like the real one. Then one of YouTube.'}]},
  {id: 'city', label: '2022, Peepal Co', cut: 'cut', mood: 'build', lines: [
    {text: 'In 2022, I joined Peepal Co in Bengaluru.', say: 'In twenty twenty two, I joined Peepal Co in Bengaluru.'},
    {text: 'I started on CoinSwitch, then moved to Lemonn, our stock market app.', say: 'I started on Coin Switch, then moved to Lemon, our stock market app.'}]},
  {id: 'chart', label: 'Lemonn', cut: 'fade', mood: 'build', lines: [
    {text: 'At Lemonn, I drew our trading charts from scratch. Every candle, every line.', say: 'At Lemon, I drew our trading charts from scratch. Every candle, every line.'},
    {text: 'Traders can plan a trade right on the chart, and test the idea on past days first.'}]},
  {id: 'summit', label: 'Piece by piece', cut: 'fade', mood: 'peak', lines: [
    {text: 'Piece by piece, it grew into the chart our traders use every day.'}]},
  {id: 'leap', label: 'The leap', cut: 'white', mood: 'drop', hold: [0.9, 4.6], lines: [
    {text: 'This year, I took a leap.'}]},
  {id: 'zing', label: 'Zing Trade', cut: 'white', mood: 'bloom', lines: [
    {text: 'I started Zing Trade, a browser extension.'},
    {text: 'It brings our trading strategies into the apps people already use, like Groww, Kite, Upstox and Dhan.', say: 'It brings our trading strategies into the apps people already use, like Grow, Kite, Upstox and Dhan.'}]},
  {id: 'jassi', label: 'Jassi', cut: 'black', mood: 'night', lines: [
    {text: 'I also built Jassi, a bot that keeps watch over our app at night.'},
    {text: 'When something breaks, it wakes the right person.'}]},
  {id: 'now', label: 'Now', cut: 'fade', mood: 'bloom', lines: [
    {text: 'Four years on, I’m a senior engineer.'},
    {text: 'And I’m back on CoinSwitch, where I started, giving it a whole new look.', say: 'And I’m back on Coin Switch, where I started, giving it a whole new look.'}]},
  {id: 'home', label: 'Still that kid', cut: 'fade', mood: 'resolve', lines: [
    {text: 'I’m still that kid from Chakar.'},
    {text: 'I still want things to look right.'}]},
  {id: 'end', label: 'Say hello', cut: 'white', mood: 'end', hold: [0.8, 5.5], lines: [
    {text: 'If you’re building something, I’d love to hear from you.'}]},
];
