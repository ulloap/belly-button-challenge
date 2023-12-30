/* Use the d3 library to read in samples.json from the URL 
https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
*/
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

const dataPromise = d3.json(url)

d3.json(url).then(function(data) {
    console.log(data);
});

// Initialize the page with a default plot
function init() {
    // Use d3 to to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset")

    // Parse through the json info to get variables
    d3.json(url).then((data) => {
        let names = data.names;

        names.forEach((id) => {
            dropdownMenu
            .append("option")
            .text(id)
            .property("value", id);
        });

        // Assign the first sample for the default functions
        let sample1 = names[0];
        buildBarChart(sample1);
        buildBubbleChart(sample1);
        buildMetaData(sample1);
    });
};
init();

// Function for metadata (demographics)
function buildMetaData(sample) {
    d3.json(url).then((data) => {
        // Assign all data to variable
        let metadata = data.metadata;
        // Filter to match with it's own sample number
        let filtering = metadata.filter(value => value.id == sample);
        let filtered = filtering[0];

        // Clear out existing metadata
        d3.select("#sample-metadata").html("");

        // Object.entries will add all the filtered key/values
        Object.entries(filtered).forEach(([key,value]) => {
            // h5 on html holds key values
            d3.select("#sample-metadata").append("h5").text(`${key}:${value}`);
        });
    });
};

/* Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs
found in that individual */
// Bar chart function
function buildBarChart(sample) {
    d3.json(url).then((data) => {
        // Retrieve the sample.data
        let info = data.samples;
        let filteringBar = info.filter(value => value.id == sample);

        // log the array to console
        console.log(filteringBar)
        let filteredBar = filteringBar[0];

        // Assign values(sample_values), labels(otu_ids), and hovertext(out_labels)
        let sample_values = filteredBar.sample_values;
        let otu_labels = filteredBar.otu_labels;
        let otu_ids = filteredBar.otu_ids;

        // Get top 10 otus
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse()

        let trace = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };
        let layout = {
            title: "Top 10 Bacteria Present"
        };
        // Plotly to plot data with layout for html
        Plotly.newPlot("bar", [trace], layout);
    })
}

// Initialize the function
init();

// Build bubble chart
function buildBubbleChart(sample) {

    // D3 retrieves all data
    d3.json(url).then((data) => {
        let info = data.samples;
        let filteringBubbleChart = info.filter(result=>result.id==sample);
        let filteredBubbleChart = filteringBubbleChart[0];

        // Assign values(sample_values), labels(otu_ids), and hovertext(out_labels)
        let sample_values = filteredBubbleChart.sample_values;
        let otu_labels = filteredBubbleChart.otu_labels;
        let otu_ids = filteredBubbleChart.otu_ids;
        
        // Create look for chart
        let trace2 = {
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
        // Make layout
        let layout2 = {
            title: "Bacteria per Sample",
            hovermode: "closest",
            xaxis: {title:"OTU ID"}
        };
        // Call Plotly to display the chart
        Plotly.newPlot("bubble", [trace2], layout2)
    });
}

// Make sure charts are updated when the sample is changed
function optionChanged(value) {
    // Call the functions
    buildBarChart(value)
    buildBubbleChart(value)
    buildMetaData(value)
};

init() 