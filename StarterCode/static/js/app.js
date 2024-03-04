// url in a constant variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);
});

// Create init function for dropdown
function init() {

    // Use D3.select for the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use D3 to get sample names to be populated in the drop-down selector
    d3.json(url).then((data) => {
        
        // Variable set for the sample names
        let sample = data.names;

        // Add  samples to dropdown menu 
        // log the value during each iteration of the loop
        sample.forEach((id) => {
            console.log(id);
            dropdownMenu.append("option").text(id).attr("value",id);
        });

        // Set the first sample from the list and log
        let first_sample = sample[0];
        console.log(first_sample);

        // Build plots
        buildMetadata(first_sample);
        buildBarChart(first_sample);
        buildBubbleChart(first_sample);
        buildGaugeChart(first_sample);

    });
};

// Create function to populates metadata info
function buildMetadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        let metadata = data.metadata;

        // Filter based on the value of the sample ID
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the filter apply
        console.log(value)

        // Get the first index from the array
        let sampledata = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair and log to metadata panel
        Object.entries(sampledata).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Create function to build bar chart
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        let sampleInfo = data.samples;

        // Filter based on the value of the sample ID
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valuedata = value[0];

        // Set the otu_ids, lables, and sample values and log to console
        let otu_ids = valuedata.otu_ids;
        let otu_labels = valuedata.otu_labels;
        let sample_values = valuedata.sample_values;
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display 
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Create the trace for the bar chart and layout using Plotly
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 OTUs Present"
        };

        Plotly.newPlot("bar", [trace], layout)
    });
};

// Create function to build the bubble chart
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {
        let sampleinfo = data.samples;

        // Filter based on the value of the sample ID
        let value = sampleinfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Set the otu_ids, lables, and sample values and log to console
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart and layout using Plotly
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Create function that updates dashboard when sample ID is changed
// Log the new value
function optionChanged(value) { 
    console.log(value); 

    // functions 
    buildMetadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
    buildGaugeChart(value);
};

// initialize function
init();
