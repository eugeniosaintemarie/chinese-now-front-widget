const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;
const weekday = date.getDay();
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();

const hanziNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

function formatYear(y) {
  const chars = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  let hanzi = y.toString().split('').map(d => chars[parseInt(d)]).join('');
  let pinyin = y.toString().split('').map(d => {
    return ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"][parseInt(d)];
  }).join(' ');
  return { hanzi: hanzi + "年", pinyin: pinyin + " nián" };
}

function formatCompositeNum(num) {
  if (num <= 10) {
    return { 
      hanzi: hanziNums[num], 
      pinyin: ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ", "shí"][num] 
    };
  }
  let tens = Math.floor(num / 10);
  let ones = num % 10;
  
  let hanziTens = tens === 1 ? "十" : hanziNums[tens] + "十";
  let hanziOnes = ones === 0 ? "" : hanziNums[ones];
  
  let pinyinTens = tens === 1 ? "shí" : ["", "", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"][tens] + " shí";
  let pinyinOnes = ones === 0 ? "" : " " + ["líng", "yī", "èr", "sān", "sì", "wǔ", "liù", "qī", "bā", "jiǔ"][ones];
  
  return { 
    hanzi: hanziTens + hanziOnes, 
    pinyin: (pinyinTens + pinyinOnes).trim() 
  };
}

const mesesHanzi = ["", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const mesesPinyin = ["", "yī yuè", "èr yuè", "sān yuè", "sì yuè", "wǔ yuè", "liù yuè", "qī yuè", "bā yuè", "jiǔ yuè", "shí yuè", "shí yī yuè", "shí èr yuè"];

const diasHanzi = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
const diasPinyin = ["xīng qī rì", "xīng qī yī", "xīng qī èr", "xīng qī sān", "xīng qī sì", "xīng qī wǔ", "xīng qī liù"];
const diasEs = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

function getEstacion(m) {
  if (m === 12 || m === 1 || m === 2) return { hanzi: "夏季", pinyin: "xià jì", es: "SUMMER" };
  if (m >= 3 && m <= 5) return { hanzi: "秋季", pinyin: "qiū jì", es: "AUTUMN" };
  if (m >= 6 && m <= 8) return { hanzi: "冬季", pinyin: "dōng jì", es: "WINTER" };
  return { hanzi: "春季", pinyin: "chūn jì", es: "SPRING" };
}

const añoData = formatYear(year);
const estacionData = getEstacion(month);
const horaHz = formatCompositeNum(hours);
const minHz = formatCompositeNum(minutes);
const secHz = formatCompositeNum(seconds);

let widget = new ListWidget();
widget.backgroundColor = new Color("#09090b");
widget.setPadding(10, 12, 10, 12);

let timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
let timeHzStr = `${horaHz.hanzi}点 : ${minHz.hanzi}分 : ${secHz.hanzi}秒`;
let timePyStr = `${horaHz.pinyin} diǎn : ${minHz.pinyin} fēn : ${secHz.pinyin} miǎo`;

let clockHzText = widget.addText(timeHzStr);
clockHzText.textColor = new Color("#ff453a");
clockHzText.font = Font.boldSystemFont(26);
clockHzText.minimumScaleFactor = 0.8;

let clockPyText = widget.addText(`${timePyStr}  |  ${timeStr}`);
clockPyText.textColor = new Color("#ffffff");
clockPyText.textOpacity = 0.6;
clockPyText.font = Font.systemFont(10);

widget.addSpacer(14);

let grid = widget.addStack();
grid.layoutVertically();

let row1 = grid.addStack();
row1.layoutHorizontally();

let cell1 = row1.addStack(); 
cell1.layoutVertically();
cell1.size = new Size(160, 0);
addBlock(cell1, diasHanzi[weekday], `${diasPinyin[weekday]} ${diasEs[weekday]}`);

let cell2 = row1.addStack(); 
cell2.layoutVertically();
addBlock(cell2, mesesHanzi[month], `${mesesPinyin[month]} ${month}`);

grid.addSpacer(14);

let row2 = grid.addStack();
row2.layoutHorizontally();

let cell3 = row2.addStack(); 
cell3.layoutVertically();
cell3.size = new Size(160, 0);
addBlock(cell3, estacionData.hanzi, `${estacionData.pinyin} ${estacionData.es}`);

let cell4 = row2.addStack(); 
cell4.layoutVertically();
addBlock(cell4, añoData.hanzi, `${añoData.pinyin} ${year}`);

function addBlock(stack, hanzi, sub) {
  let hText = stack.addText(hanzi);
  hText.textColor = new Color("#ff453a");
  hText.font = Font.boldSystemFont(23);
  hText.minimumScaleFactor = 0.75;
  
  stack.addSpacer(2);
  
  let sText = stack.addText(sub);
  sText.textColor = new Color("#ffffff");
  sText.textOpacity = 0.7;
  sText.font = Font.systemFont(11);
  sText.minimumScaleFactor = 0.7;
}

Script.setWidget(widget);
Script.complete();

let quinceMinutos = 15 * 60 * 1000;
widget.refreshAfterDate = new Date(Date.now() + quinceMinutos);

widget.presentMedium();
