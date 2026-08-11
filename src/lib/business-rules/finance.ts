export const clamp=(value:number,min=0,max=1)=>Math.min(max,Math.max(min,value));
export function grossMargin(barePrice:number,cost:number){return barePrice>0?(barePrice-cost*.87)/barePrice:0}
export function ltaPrice(initialBarePrice:number,ltaPercentages:number[],yearIndex:number){let price=initialBarePrice;for(let i=1;i<=yearIndex;i++)price*=1-(ltaPercentages[i]??0)/100;return price}
export function productionFinancials(deliveredQuantity:number,unitPrice:number,unitCost:number){const revenue=deliveredQuantity*unitPrice;return{revenue,profit:revenue-deliveredQuantity*unitCost*.87}}
export function rfqScore(input:{customerValue:number;margin:number;technicalMatch:number;competitiveAdvantage:number;strategicSignificance:number}){const score=clamp(input.customerValue/100)*20+clamp(input.margin/.35)*25+clamp(input.technicalMatch/5)*20+clamp(input.competitiveAdvantage/5)*20+clamp(input.strategicSignificance/5)*15;return Math.round(score*100)/100}
export function valueGrade(score:number){return score>=80?"A":score>=65?"B":score>=50?"C":"D"}
