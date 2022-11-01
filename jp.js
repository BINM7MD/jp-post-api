var JSSoup = require("jssoup").default;
var JSPostEndPoint = "https://trackings.post.japanpost.jp/services/srv/search/direct?locale=en&reqCodeNo1=";
var SuperAgent = require("superagent");
function GetZipIndex(Soup){
    for(var i = 0; i< Soup.length; i++){
        if(Soup[i].text == "ZIP code（Postal code number）"){
            return i;
        }
    }
}
function GetIndexs(Soup){
    var Rows = [];
    for(var i = 0; i< Soup.length; i++){
        if(Soup[i].toString().includes("rowspan")){
            Rows.push(i);
        }
    }
    return Rows;
}
function GetElements(Soup, SiblingsIndexs){
    var SoupElements = [];
    for(var i = 0; i< SiblingsIndexs.length; i++){
        SoupElements.push(Soup[SiblingsIndexs[i]])
    }
    return SoupElements;
}

class Shipment{
    constructor(tracking_id){
        this.tracking_id = tracking_id;
    }
    
   async getTracking(){
        var HTMLTracking = await SuperAgent.get(`${JSPostEndPoint}${this.tracking_id}`);
        if(HTMLTracking.statusCode == 200){
            var soup = new JSSoup(HTMLTracking.text);
            var Table = soup.findAll("table" , "m_b5")[1];
            var TH = soup.findAll("th") 
            var ZipIndex = GetZipIndex(TH);
            var FirstRow = TH[ZipIndex].nextElement.nextElement;
            var FirstRowSiblings = FirstRow.findNextSiblings("tr");
            var SiblingsIndexs = GetIndexs(FirstRowSiblings);
            var RestRows = GetElements(FirstRowSiblings , SiblingsIndexs);  
            var ShipmentInfo = [];
            ShipmentInfo.push(FirstRow.descendants[1] + "|" + FirstRow.descendants[3]  + "|" + FirstRow.descendants[6]);
            RestRows.forEach(element => {
                ShipmentInfo.push(element.descendants[1] + "|" + element.descendants[3]  + "|" + element.descendants[6]);
            });
            return ShipmentInfo;
        }else{
            return `Error response ${HTMLTracking.statusCode}`
        }
      
    }
}


module.exports = Shipment;
