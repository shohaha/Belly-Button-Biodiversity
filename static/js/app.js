var filter = d3.select("#selDataset");

// Starting reference to display
var samp = "940"

// Handle changes
function optionChanged(sample) {
    samp = sample;

    console.log(samp);

    renderProcess();
};

// Display once loaded
renderProcess();

function renderProcess(){

    d3.html('');

    d3.json("samples.json").then((data) => {
        // Create variable to hold samples array
        var samples = data.samples;

        // Create a variable that holds the metadata array
        var metadata = data.metadata;

        // Data for drop down menu
        var valdrop = samples.map(item => item.id)
        .filter((value, index, self) => self.indexOf(value) === index);

        // Create drop down menu
        valdrop.forEach(function (values) {
            filter.append('option').text(values);
        });

        // Collates samples data
        var resultArray = samples.filter(sampleObj => sampleObj.id == samp);

        console.log(resultArray);

        // Add first sample to variable
        var result = resultArray[0];

        // Variables to hold chart values
        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;

        // Format x, y tickers and labels for bar chart in descending order
        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var xticks = sample_values.slice(0, 10).reverse();
        var labels = otu_labels.slice(0,10).reverse();

        console.log(yticks);
        console.log(xticks);
        console.log(labels);

        var trace1 = {
            x: xticks,
            y: yticks,
            text: labels,
            orientation: 'h',
            type: 'bar'
        };

        var data = [trace1]

        var layout = {
            title: 'Top 10 OTUs Found'
        };

        Plotly.newPlot('bar', data, layout);

        // Generate Bubble Chart //

        // Data for chart
        var xticksbub = otu_ids.slice(0,10);
        xticksbub.push.apply(xticksbub, otu_ids.slice(Math.max(otu_ids.length - 10, 1)));

        var yticksbub = sample_values.slice(0, 10);
        yticksbub.push.apply(yticksbub, sample_values.slice(Math.max(sample_values.length - 10, 1)));

        var labelsbub = otu_labels.slice(0, 10);
        labelsbub.push.apply(labelsbub, otu_labels.slice(Math.max(otu_labels.length - 10,1)));

        console.log(xticksbub);
        console.log(labelsbub);
        console.log(yticksbub);

        // Plot data
        var trace1 = {
            x: xticksbub,
            y: yticksbub,
            mode: 'markers',
            marker: {
                color: xticksbub,
                size: yticksbub,
                colorscale: "Earth"
            },
            text: labelsbub
        };

        var data = [trace1];

        var layout = {
            title: 'First 10 and Last 10 Samples',
            xaxis: {
                title: "OTU ID"
            },
            showlegend: false,
            height: 600,
            width: 1200
        };

        Plotly.newPlot('bubble', data, layout);

        // Demographic Chart//

        // Metadata to use
        var resultArray2 = metadata.filter(metaObj => metaObj.id == samp);

        console.log(resultArray2);

        var result2 = resultArray2[0];

        // Create demographic variables

        var age = result2.age;
        var bbtype = result2.bbtype;
        var ethnicity = result2.ethnicity;
        var gender = result2.gender;
        var id = result2.id;
        var location = result2.location;
        var wfreq = result2.wfreq;

        // Create formatting to read data
        var demoinfo = `id: ${id} <br> ethnicity: ${ethnicity} <br> gender: ${gender} <br> age: ${age} <br> location: ${location} <br> bbtype: ${bbtype} <br> wfreq: ${wfreq}`

        document.getElementById('sample-metadata').innerHTML = demoinfo;

        // Bonus: Wash Frequency //

        var data = [
            {
                title: {text: "Belly Button Washing Frequency <br> Scrubs per Week"},
                type: "indicator",
                mode: "gauge+number",
                value: wfreq,

        // Create gauge range from 0-9
                gauge: {
                    axis: { range: [null, 9], ticks:9},
                    steps: [
                        { range: [0, 1], color: "lightgray"},
                        { range: [1, 2], color: "gray"},
                        { range: [2, 3], color: "lightgray"},
                        { range: [3, 4], color: "gray"},
                        { range: [4, 5], color: "lightgray"},
                        { range: [5, 6], color: "gray"},
                        { range: [6, 7], color: "lightgray"},
                        { range: [7, 8], color: "gray"},
                        { range: [8, 9], color: "lightgray"}
                    ],
                    threshold: {
                        line: { color: "red", width: 3},
                        thickness: 0.75,
                        value: wfreq
                    }
                }
            }
        ];

        var layout = { width: 600, height: 450, margin: { t: 0, b: 0 }};
        Plotly.newPlot('gauge', data, layout);

    });


};