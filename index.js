import axios from "axios";
import cheerio from "cheerio";

import { getAddressUrls } from "./ggsheet.js";

(async () => {
  const sheet = await getAddressUrls();
  const rows = await sheet.getRows();

  for (let row of rows) {
    try {
        let url = row.get("address_url")
      console.log(url);

      let querySelectors = ["", ""];
     

      const response = await axios.get(row.get("address_url"));
      const html = await response.data;
      const $ = cheerio.load(html);
      const ethvalue = $("#ContentPlaceHolder1_divSummary .col-md-8")[1].children[0].data.split('$')[1];
    
      console.log(`ETH value: ${ethvalue}`);

      let tokenElement;
     
      if($("a#availableBalanceDropdown").length > 0) {
        tokenElement = $("a#availableBalanceDropdown")
        .contents().filter(function() {
            return this.nodeType === 3; // Chọn các phần tử văn bản (#text)
        })
        .text()     
        .replace("\n", "")
        .replace("                                    ", "").split('$')[1];
      } else {
        tokenElement = $('.col-md-8').eq(0).text().split(" ")[0]
      }
      
      console.log(
        `Token holding: ${
            tokenElement
                }`
      );

      row.set('tick1', true)
      if(parseFloat(ethvalue) > 100 || parseFloat(tokenElement) > 100) {
        console.log("Update tick2")
        row.set("tick2", true)
      }

      await row.save()
    } catch (e) {
      console.log(e);
    }
  }
})();