const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let h = 550;
let w = 800;
let padding = 40;

d3.select('#svg').
append('h1').
text('United States GDP').
attr('id', 'title');

let tooltip = d3.select('#svg').
append('div').
attr('id', 'tooltip').
style('opacity', 0).
style('position', 'absolute');

let svg = d3.select('#svg').
append('svg').
attr('height', h).
attr('width', w);

svg.append('text').
text('Gross Domestic Product').
attr('x', -h / 2 - 30).
attr('y', padding + 15).
attr('transform', 'rotate(-90)');


d3.json(url).then(data => {
  let prices = data.data.map(d => d[1]);
  let dates = data.data.map(d => d[0]);
  let datesTime = data.data.map(d => new Date(d[0]));



  let firstDate = datesTime[0];
  let lastDate =
  datesTime[dates.length - 1];

  let xScale = d3.scaleTime().
  domain([firstDate, lastDate]).
  range([padding, w - padding]);

  let xAxis = d3.axisBottom(xScale);

  let gdpMax = d3.max(prices);
  let gdpScale = d3.scaleLinear().
  domain([0, gdpMax]).
  range([padding, h - padding]);

  let yScale = d3.scaleLinear().
  domain([0, gdpMax]).
  range([h - padding, padding]);

  let yAxis = d3.axisLeft(yScale);



  let rect = svg.selectAll('rect').
  data(prices).
  enter().
  append('rect').
  attr('width', (w - 2 * padding) / 275).
  attr('height', d => gdpScale(d) - padding).
  attr('x', (d, i) => xScale(datesTime[i])).
  attr('y', d => h - gdpScale(d)).
  attr('class', 'bar').
  attr('data-date', (d, i) => dates[i]).
  attr('data-gdp', d => d);

  rect.on('mouseover', function (event, d) {
    const e = rect.nodes();
    let i = e.indexOf(this);

    tooltip.transition().
    duration(200).
    style('opacity', 0.9);

    tooltip.attr('data-date', dates[i]);
    tooltip.html(dates[i] + '<br>$' + d + ' Billion').
    style('left', xScale(datesTime[i]) + 200 + 'px').
    style('top', 600 + 'px');
  }).
  on('mouseout', function (d) {
    tooltip.transition().
    duration(200).
    style('opacity', 0);
  });



  svg.append('g').
  attr('transform', 'translate(' + padding + ',0)').
  call(yAxis).
  attr('id', 'y-axis');

  svg.append('g').
  attr('transform', 'translate(0, ' + (h - padding) + ')').
  call(xAxis).
  attr('id', 'x-axis');
  d3.selectAll('.tick').
  attr('class', 'tick');

});