import '@logseq/libs'
import {
  BlockEntity,
  PageEntity,
  IBatchBlock,
} from '@logseq/libs/dist/LSPlugin.user';
/**
* main entry
*/
function timeConverter(x:number){
  var a = new Date(x * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = year + month + date;
  return time;
}


async function main () {
    const uniqueIdentifier = () =>
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '');

    logseq.provideModel({
      async insertFormattedBlock (e: any) {
        const { blockUuid, propertyName, title, displayer, range} = e.dataset
        var query = `
        [:find (pull ?b [*])
        :where
        [?b :block/properties ?p]
        [(get ?p :${propertyName})]]
 `
 console.log(range)

        try {
            let ret = await logseq.DB.datascriptQuery(query)
            const result0 = ret?.flat()
            logseq.Editor.insertBlock(blockUuid, title, {sibling:false})
            
            logseq.Editor.insertBlock(blockUuid, "Date", {sibling:false})
            logseq.Editor.insertBlock(blockUuid, propertyName, {sibling:false})

            let parentBlock = await logseq.Editor.getBlock(blockUuid, {includeChildren:true})
            if (parentBlock?.children) { //Checking to make sure blocks were successfully created
            //defining constants
            let headerBlock = parentBlock.children[0]
            let x_value_block = parentBlock.children[1]
            let y_value_block = parentBlock.children[2]
            let header_uuid = headerBlock["uuid"]
            let x_uuid = x_value_block["uuid"]!
            let y_uuid = y_value_block["uuid"]
            //defining time filters    
            let date = Math.round((new Date()). getTime() / 1000);
            let adjustedDate = date - range*86400  
            let cutoff = timeConverter(adjustedDate)

            if(result0 && result0.length > 0) { //Ensuring that the results of the datascript query isn't empty
                var results = []
                for (const constant in result0) {
                    try {
                        if ([result0[constant]][0]["journal?"]){
                            if (![result0[constant]][0]["page"]!= undefined){
                              if([result0[constant]][0]["journal-day"] > cutoff){
                                console.log("success")
                                console.log(range)
                                console.log(cutoff)
                                results.push([result0[constant]][0])
                              }
                            }
                        }
                    }
                    catch(err){
                        console.log(err)
                    }
                }
                results.sort((a, b) => {
                    return [a][0]["journal-day"] - [b][0]["journal-day"];
                });
                for (const constant in results) {
                    if ([results[constant]][0]["original-name"] !== undefined){
                    logseq.Editor.insertBlock(x_uuid,[results[constant]][0]["original-name"], {sibling:false});
                    logseq.Editor.insertBlock(y_uuid,String([results[constant]][0]["properties"][propertyName]),{sibling: false});
                    
                    }
                }

              }
              console.log("Hello")
              logseq.Editor.updateBlock(blockUuid, `{{renderer :${displayer}s_${uniqueIdentifier()}}}`);
              logseq.Editor.moveBlock(y_uuid, header_uuid,{children:true});
              logseq.Editor.moveBlock(x_uuid, header_uuid,{children:true});
            }
              
            }
         catch (err) {
            console.log(err)
          }
        
      },
}),
    logseq.provideStyle(`
    .formatter-btn {
       border: 1px solid var(--ls-border-color); 
       white-space: initial; 
       padding: 2px 4px; 
       border-radius: 4px; 
       user-select: none;
       cursor: default;
       display: flex;
       align-content: center;
    }
    
    .formatter-btn:hover {
        background-color: #defcf0;
        border-color: #9ddbc7;
        color: #0F9960;
    }
  `)

  logseq.Editor.registerSlashCommand('Property Visualizer', async () => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :property_visualizer, }}`);
  });
  
  logseq.Editor.registerSlashCommand('Property Visualizer (guided)', async () => {
    await logseq.Editor.insertAtEditingCursor(`{{renderer :property_visualizer, property name, chart/table styling(eg. data nosum, area white 500), chart/table, date range}}`);
  });

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    var [type, template, title, displayStyle, dateRange] = payload.arguments;
    if (title == undefined){
      title = "data"
    }

    if (displayStyle == undefined){
      displayStyle = "table"
    }
    if (dateRange == undefined){
      dateRange = "10000"
      console.log("ultimate")
    }
// logseq.Editor.removeBlock

      if (type == ':property_visualizer'){
      logseq.provideUI({
          key: 'logseq visualizer plugin',
          reset: true,
          slot,
          template: `
          <button class="templater-btn" data-block-uuid="${payload.uuid}" data-property-name="${template}" data-title="${title}" data-displayer="${displayStyle}" data-range="${dateRange}"
          data-on-click="insertFormattedBlock">Visualize ${template} as ${displayStyle}</button>
         `,
        });
      }
      else return;
  });
}

logseq.ready(main).catch(console.error)
