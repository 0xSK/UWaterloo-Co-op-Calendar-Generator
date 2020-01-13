function pad(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

function createCalendar(domContent) {
  // Create Calendar object
  cal = ics();
  addedEvents = false;

  $(domContent).find('div.expandable').each(function(index) {
    // for each month
    month_year = $.trim($(this).find('h2 button').text());
    month = month_year.match(/[a-zA-Z]+/g)[0];
    year = month_year.match(/\d\d\d?\d?/g)[0];

    // get each cell in month-calendar
    cells = $(this).find('td');
    $(cells).each(function(cell_idx) {
      // for each cell
      temp1 = $(this).find('span').text().match(/\d\d?/g);
      if (temp1 == null) return;  // if cell doesn't have day, continue
      date = temp1[0];
      date_obj = new Date(Date.parse(month + ' ' + date + ', ' + year));
      date_string = pad(date_obj.getMonth() + 1, 2) + '/' +
          pad(date_obj.getDate(), 2) + '/' + date_obj.getFullYear();

      $(this).find('span p').each(function(idx1) {
        // for each event in cell
        description = $(this).text();
        links = [];
        $(this).find('a').each(function(idx2) {
          // for each link in event
          links[idx2] = $(this).attr('href');
          if (links[idx2][0] == '/')
            links[idx2] = 'https://uwaterloo.ca' + links[idx2];
        });
        cal.addEvent(
            description, links.join('\n'), '', date_string, date_string);
        addedEvents = true;
      });
    });
  });
  if (addedEvents) cal.download('Co-op Important Dates');
}

chrome.browserAction.onClicked.addListener(function(tab) {
  if (String(tab.url).includes(
          'uwaterloo.ca/co-operative-education/important-dates')) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {text: 'return_DOM'}, createCalendar);
    });
  } else {
    console.log('creating tab');
    chrome.tabs.create(
        {url: 'https://uwaterloo.ca/co-operative-education/important-dates'});
    setTimeout(function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, {text: 'return_DOM'}, createCalendar);
      });
    }, 2500);
  }
});
