// The story, one entry per chapter in reading order. Each chapter's drawing and motion live in chapters/<id>.js.
//   len:    how many screens of scrolling the chapter lasts (neighbours overlap by a little more than half a screen)
//   ground: the page colour behind it; ink: true for a pale chapter, so the words and lines turn dark
//   mood:   which chord of music plays under it (see sound.js)
//   text:   what you read. at = [in, out] in screens from the chapter's start; h is the big line, p the quieter one
window.STORY = [
  {id: 'open', label: 'Start', len: 3.4, ground: '#072f68', mood: 'intro', text: [
    {at: [0, 1.25], title: true},
    {at: [1.45, 3.1], h: 'I build the screens people use to trade.', p: 'This is how I got here.'}]},
  {id: 'chakar', label: 'Chakar, Punjab', len: 4.6, ground: '#0d3673', mood: 'village', text: [
    {at: [.5, 4.1], h: 'I grew up in Chakar.', p: 'A small village in Punjab, near Jagraon, where I went to the government school.'}]},
  {id: 'radio', label: 'Electronics', len: 3.8, ground: '#021533', mood: 'night', text: [
    {at: [.45, 3.3], h: 'As a kid, I loved electronics and computers.', p: 'I wanted to know how they worked. I cared how they looked, too.', layout: 'stack'}]},
  {id: 'psd', label: 'Photoshop', len: 4.2, ground: '#0d3673', mood: 'wonder', text: [
    {at: [.45, 2.2], h: 'Design came first.', p: 'I taught myself Photoshop, one layer at a time. That’s where my Instagram name comes from: jaskaran.psd'},
    {at: [2.45, 3.8], h: 'Then I tried video editing.'}]},
  {id: 'css', label: 'Class 11', len: 3.8, ground: '#1d498b', mood: 'wonder', text: [
    {at: [.45, 1.8], h: 'In class 11, I started building websites.', p: 'I learned from YouTube videos.'},
    {at: [2, 3.4], h: 'I fell for CSS.', p: 'Change one line, and the whole screen changes.'}]},
  {id: 'pen', label: 'CodePen', len: 4, ground: '#0d3673', mood: 'village', text: [
    {at: [.45, 3.6], h: 'I made things just to see if I could.', p: 'A phone, a bus, a tree that draws itself.'}]},
  {id: 'masai', label: '2021', len: 4, ground: '#fdfdfd', ink: true, mood: 'bright', text: [
    {at: [.45, 2], h: 'In 2021, a YouTube ad led me to Masai School.'},
    {at: [2.15, 3.6], h: 'I built a copy of Instagram.', p: 'It looked just like the real one. Then I built one of YouTube.'}]},
  {id: 'city', label: '2022, Peepal Co', len: 4.2, ground: '#1d498b', mood: 'build', text: [
    {at: [.45, 3.8], h: 'In 2022, I joined Peepal Co in Bengaluru.', p: 'I started on CoinSwitch, then moved to Lemonn, our stock market app.'}]},
  {id: 'chart', label: 'Lemonn', len: 5.2, ground: '#072f68', mood: 'night', text: [
    {at: [.45, 2], h: 'I drew our trading charts from scratch.', p: 'Every candle and every line.'},
    {at: [2.15, 3.45], h: 'Plan a trade right on the chart.', p: 'And test the idea on past days first.'},
    {at: [3.6, 4.85], h: 'It grew into the chart our traders use every day.'}]},
  {id: 'leap', label: 'The leap', len: 3.4, ground: '#d6e9f6', ink: true, mood: 'drop', text: [
    {at: [.55, 2.9], h: 'This year, I took a leap.'}]},
  {id: 'zing', label: 'Zing Trade', len: 4, ground: '#fdfdfd', ink: true, mood: 'bloom', text: [
    {at: [.45, 3.6], h: 'I started Zing Trade.', p: 'A browser extension that brings our trading strategies into the apps people already use, like Groww, Kite, Upstox and Dhan.'}]},
  {id: 'jassi', label: 'Jassi', len: 4, ground: '#021533', mood: 'night', text: [
    {at: [.45, 2.1], h: 'I built Jassi, a bot that keeps watch at night.'},
    {at: [2.3, 3.6], h: 'When something breaks, it wakes the right person.'}]},
  {id: 'now', label: 'Now', len: 4, ground: '#072f68', mood: 'bloom', text: [
    {at: [.45, 2], h: 'Four years on, I’m a senior engineer.'},
    {at: [2.15, 3.6], h: 'And I’m back on CoinSwitch.', p: 'Where I started, giving it a whole new look.'}]},
  {id: 'home', label: 'Still that kid', len: 4, ground: '#3569ad', mood: 'resolve', text: [
    {at: [.45, 2], h: 'I’m still that kid from Chakar.'},
    {at: [2.2, 3.6], h: 'I still want things to look right.'}]},
  {id: 'end', label: 'Say hello', len: 2.2, ground: '#fdfdfd', ink: true, mood: 'end', text: [{at: [.35, 9], end: true}]},
];
