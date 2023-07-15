let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
let req = new XMLHttpRequest()

let width = 1000
let height = 800
let padding = 60

let xScale
let yScale

let baseTemp
let values = []

let svg = d3.select("svg")
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
  svg.attr("width", width)
  svg.attr("height", height)
}

let generateScales = () => {
  xScale = d3.scaleLinear()
              .range([padding, width - padding])
              .domain([d3.min(values, (item) => {
                return item["year"]}), d3.max(values, (item) => {
                  return item["year"]
                }) + 1])
             
  
  yScale = d3.scaleTime()
              .range([padding, height - padding])
              .domain([new Date(0,0,0,0, 0, 0, 0), new Date(0,12,0,0,0,0,0)])
  
}

let drawData = () => {
  svg.selectAll('rect')
     .data(values)
     .enter()
     .append('rect')
     .attr('class', 'cell')
     .attr('fill', (item) => {
    let variance = item['variance']
    if (variance >= 4){
      return '#f00c0c'
    }else if (variance >= 1){
      return '#eb491c'
    }else if (variance >= 0){
      return '#ffbf75'
    } else if (variance >= -1){
      return '#ade9f7'
    } else if (variance >= -3){
      return '#15aceb'
    } else {
      return '#0283b8'
    }
  })
  
  .attr('data-year', (item) => {
            return item['year']
        })
  .attr('data-month', (item) => {
            return item['month'] - 1
        })
   .attr('data-temp', (item) => {
            return baseTemp + item['variance']
  })
    .attr('height', (height - (2 * padding))/12)
    .attr('width', (item) => {
      let minYear = d3.min(values, (item) => {
        return item['year']
        })
      let maxYear = d3.max(values, (item) => {
        return item['year']
        })
     let yearCount = maxYear - minYear
     
     return (width - (2 * padding))/yearCount
  })
     .attr('y', (item) => {
            return yScale(new Date(0, item['month']-1, 0, 0, 0, 0, 0))
        })
      .attr('x', (item) => {
    return xScale(item['year'])
  })
     .on('mouseover', (item) => {
            tooltip.transition()
                .style('visibility', 'visible')
            
            let monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
            ]
        
            tooltip.text(item['year'] + ' ' + monthNames[item['month'] -1 ] + ' : ' + item['variance'])

            tooltip.attr('data-year', item['year'])
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
          }

let generateAxes = () => {
  //'month' is second item in data, numbers correspond to months e.g. 1 = jan etc.
  let xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format('d'))
    svg.append('g')
      .call(xAxis)
      .attr('id','x-axis')
      .attr('transform', 'translate(0,' + (height-padding) +')')
      
  let yAxis = d3.axisLeft(yScale)
  .tickFormat(d3.timeFormat("%B"))
  svg.append('g')
      .call(yAxis)
      .attr('id','y-axis')
     .attr('transform', 'translate(' + padding + ', 0)')
}

let drawLegend = () => {
  d3.select('#legend')
  
}

req.open('GET', url, true)
req.onload = () => {
  let object = JSON.parse(req.responseText)
  baseTemp = object['baseTemperature']
  values = object['monthlyVariance']
  drawCanvas()
  generateScales()
  drawData()
  generateAxes()
}
req.send()
