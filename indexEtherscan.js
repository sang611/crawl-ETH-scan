import axios from "axios";
import cheerio from "cheerio";

import { getAddressUrls } from "./ggsheet.js";

export const etherScan = async () => {
  const sheet = await getAddressUrls();
  const rows = await sheet.getRows();

  for (let row of rows) {
    try {
      let url = row.get("link")
      console.log(url);
     
      const response = await axios.get(url);
      const html = await response.data;
      const $ = cheerio.load(html);
      const ethvalue = $("#ContentPlaceHolder1_divSummary .card-body:nth-child(1) > div:nth-child(3)")
                                            .contents().filter(function() {
                                              return this.nodeType === 3; // Chọn các phần tử văn bản (#text)
                                          }).text()
                                            .split('$')[1].replace('/,/g', '');
    
      console.log(`ETH value: ${ethvalue}`);

      let tokenElement;
     
      if($("#dropdownMenuBalance").length > 0) {
        tokenElement = $("#dropdownMenuBalance")
        .contents().filter(function() {
            return this.nodeType === 3; // Chọn các phần tử văn bản (#text)
        })
        .text()     
        .replace("/\n/g", "")
        .replace("/ /g", "")
        .split('$')[1]
        .replace('/,/g', '');;
      } else {
        tokenElement = 0
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
      } else {
        row.set("tick2", false)
      }

      await row.save()
    } catch (e) {
      console.log(e);
    }
  }
};
