# logseq-property-visualizer
 A plugin to chart or visualize trends in the values of page properties over time. 
## Setup
1. First ensure that you have [hkgnp's](https://github.com/hkgnp) [Table Render](https://github.com/hkgnp/logseq-tablerender-plugin) and [Chart Render](https://github.com/hkgnp/logseq-chartrender-plugin) plugins
2. Use the slash menu and type `property visualizer`
3. Assign variables in the syntax
	- {{renderer :property_visualizer, {property name}, {type of graph or table}, {graph or table}, {last x days}}
4. Base the types from the readme of either plugin
5. Samples
	- `{{renderer :property_visualizer, happiness, line white 300, chart, 40}}`
		- Will generate lined chart, with width 300, color white, graphing property "happiness" over the last 40 days
		- <img width="653" alt="Screen Shot 2022-01-17 at 9 31 53 PM" src="https://user-images.githubusercontent.com/80150109/149814988-48493d84-647c-4d22-bb2e-f6ea11d8e388.png">

	- `{{renderer :property_visualizer, fulfillment}}`
		- Will generate table with sum, median and average.
		- <img width="579" alt="Screen Shot 2022-01-17 at 9 30 51 PM" src="https://user-images.githubusercontent.com/80150109/149814871-c8253215-8ce3-40ef-a5d0-851396f11c11.png">

	- `{{renderer :property_visualizer, happiness, data nosum}}`
		- Will generate simple table showing the values of happiness
		- <img width="709" alt="Screen Shot 2022-01-17 at 9 34 52 PM" src="https://user-images.githubusercontent.com/80150109/149815377-14e64b2a-03c3-48d3-956d-15388b637218.png">
6. Important: Will only fetch page properties of journal pages
	- Add a page property to every journal page when you want to track something
	- Track habits, word written, etc. 
## Limitations 
1. Only works when property is mentioned on the page property of a journal page
	- <img width="1011" alt="Screen Shot 2022-01-17 at 10 22 19 PM" src="https://user-images.githubusercontent.com/80150109/149821050-0c0b926b-a47e-4982-a301-cbb6c6cd8417.png">