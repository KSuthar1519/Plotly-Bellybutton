function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var results_selectedsample = samples.filter(
      (sampleobject) => sampleobject.id == sample
    );
    //  5. Create a variable that holds the first sample in the array.
    var first_sample = results_selectedsample[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var ids = first_sample.otu_ids;
    var labels = first_sample.otu_labels;
    var values = first_sample.sample_values;

    // -----------------BAR CHART---------------------

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        y: ids
          .slice(0, 10)
          .map((otu_ids) => `OTU ${otu_ids}`)
          .reverse(),
        x: values.slice(0, 10).reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      },
    ];
    // 9. Create the layout for the bar chart.
    var barLayout = [
      {
        title: "Top 10 Bacteria Cultures Found",
        margin: {
          l: 100,
          r: 100,
          t: 150,
          b: 50,
        },
      },
    ];
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var trace = {
      x: ids,

      y: values,
      mode: "markers",
      marker: {
        size: values,
        color: ids,
      },
      text: labels,
    };
    var data1 = [trace];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      xaxis: { title: "OTU ID" },
      margin: { t: 0 },
      hovermode: "closest",
      height: 500,
      width: 1000,
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", data1, bubbleLayout);
  });

  // 4. Create the trace for the gauge chart.
//   var gaugeData = {
//     type: "indicator",
//     x:[0],
//     y:[0],
//     mode: "guage-number",
//     title: '<b>Belly Button Washing Frequency</b> <br> <b>Scrub Per Week</b>',
//     labels: ["0", "2","4","6","8","10"]
//   }

  
//   // 5. Create the layout for the gauge chart.
//   var gaugeLayout = { 
//     width: 500,
//     height: 400,
//     margin: { t: 25, r: 25, l: 25, b: 25 },
//     paper_bgcolor: "grey",
//     font: { color: "black", family: "Arial" }
   
//   };
 
//   // 6. Use Plotly to plot the gauge data and layout.
// Plotly.newPlot("guage",gaugeData,gaugeLayout);

// Create variable for washing frequency
var washFreq = buildMetadata.wfreq

// Create the trace
var gauge_data = [
    {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Washing Frequency (Times per Week)" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            bar: {color: 'white'},
            axis: { range: [null, 9] },
            steps: [
                { range: [0, 3], color: 'rgb(253, 162, 73)' },
                { range: [3, 6], color: 'rgb(242, 113, 102)' },
                { range: [6, 9], color: 'rgb(166, 77, 104)' },
            ],
            // threshold: {
            //     line: { color: "white" },
            // }
        }
    }
];

// Define Plot layout
var gauge_layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

// Display plot
Plotly.newPlot('gauge', gauge_data, gauge_layout);
}
