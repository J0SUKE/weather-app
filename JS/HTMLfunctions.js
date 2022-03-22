export function createHTMLelement(tag,classe=null,attributes={},content="") 
{
    let elem = document.createElement(tag);
    if(classe!=null) elem.className = classe;
    
    for(let att in attributes)
    {
        att.setAttribute(att,attributes[att]);
    }
    elem.innerHTML = content;
    
    return elem;
}

export function createTimePrevisionSection(time,icon,temperature,prop) 
{
    let li = createHTMLelement("li");
    let spanTime = createHTMLelement("span","time",{},time);
    let propability = createHTMLelement("span","propability",{},prop);
    let previsionTimeIcon = createHTMLelement("span","prevision-time-icon",{},`<img src=\"${icon}\">`);
    let previsionInTime = createHTMLelement("span","prevision-in-time",{},`${temperature}°`);

    li.append(spanTime);
    li.append(propability);
    li.append(previsionTimeIcon);
    li.append(previsionInTime);

    document.querySelector(".subHero ul").append(li);

}

export function celcius(temp) 
{
    return Math.floor(temp - 273.15);    
}