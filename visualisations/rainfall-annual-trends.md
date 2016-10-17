---
layout: visualisation
title: Annual Rainfall Trends
---
<div class="container">
 <p class="vis-example-text"><a href="https://en.wikipedia.org/wiki/Gaussian_filter">Gaussian filters</a> are a common method used to explore trends in annual and seasonal rainfall. For each rainfall measurement in a series a new value is calculated that takes into account the values of neighbouring measurements. The weights used for each calculation are determined using a <a href="https://en.wikipedia.org/wiki/Normal_distribution">Gaussian distribution</a>. Consequently, the further a value is away from the centre of the filter the smaller its weight.</p>
 <p class="vis-example-text">The two most important parameters to set when applying a Gaussian filter are sigma, which is the standard deviation of the Gaussian distribution, and the filter width. Higher sigma values decrease the amplitude of the Gaussian distribution and increase the weight given to measurments further away from the filter centre. Ideally, a high sigma value is combined with a large filter width. In the visualisations below, the weights are normalised so that even in the case of a high sigma value and small filter width the weights still sum to 1. However, in such cases the resulting filter loses its Gaussian nature to some extent.</p>
 <h3 class="vis-example-title">{{ page.title }} for Indian Meteorological Regions</h3>
 <iframe src="/figs/rainfall-annual-trends.html" class="iframe-example" id="rainfall-trends" style="border:none;" scrolling="no" onload="resizeIframe(this)"></iframe>
 <p class="vis-example-text">The visualisation illustrates how varying filter widths and sigma values can significantly impact the shape of the trend line produced by a Gaussian filter. This is an important point to bear in mind when interpreting such graphs, which often play an important role in studies of rainfall trends.</p>
 <p class="vis-example-text">The visualisation was developed using <a href="https://d3js.org/">D3</a> and data downloaded from India's <a href="https://data.gov.in/">Open Government Data Platform</a>. The code can be found on <a href="https://github.com/Batch21/Batch21.github.io/tree/master/figs/rainfall-annual-trends.html">GitHub.</a></p>
</div>
