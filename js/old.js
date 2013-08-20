
function loadFrame(name){
	$('#main-content').hide();
	$('#main-menu li').removeClass('active');
	$('#main-content').load(name + '.html', function(data){
		$('#main-content').show();
		$('#menu-' + name).addClass('active');
		window.location.hash = '/' + name;
	});
}

function closeFrame(){
	$('#main-content').slideUp();
	$('#main-menu li').removeClass('active');
	window.location.hash = '';
}

$(document).ready(function() {
	/* Start Frame */
	if(window.location.hash.length > 2)
		loadFrame( window.location.hash.substr(2) );	
});


/** GALLERY **/
function loadGallery(parent, num){
	parent.jflickrfeed({
		limit: num,
		qstrings: {
			id: '84277882@N05'
		},
		itemTemplate: '<li><a class="flickr-item" rel="colorbox" href="{{image}}" title="{{title}}"><img src="{{image_m}}" alt="{{title}}"/></a></li>'
	}, function(data) {
		parent.find('li a.flickr-item').colorbox();
	});
}
		
		
function addZeros(x){
 if(x<10) return '0' + x; else return ''+x;
}

function getDateString(){
	var d = new Date();
	var y = d.getFullYear()
	var m = addZeros(d.getUTCMonth()+1);
	var s = addZeros(d.getDate());
	
	return y + '-' + m + '-' + s;
}


/** EVENTS **/
//alt=jsonc
//start-min=2006-03-16T00:00:00
//max-results=25
		
function loadEvents(parent, max_results, start, trim){
	var months = ["jan", "feb", "mar", "apr", "may", "jun", "july", "aug", "sept", "oct", "nov", "dec" ];
	
	$.getJSON('https://www.google.com/calendar/feeds/s038vh82nnteu7fbj1n4ct9q9o%40group.calendar.google.com/public/full?alt=jsonc&max-results=100&start-min=' + start + 'T00:00:00', 
	function(feed) {		
		var eventsList = [];
		if(feed.data.items){		
			// Parse Events
			for(var i = 0; i < feed.data.items.length; i++ ){
				var event = feed.data.items[i];
				var parts = event.when[0].start.match(/(\d+)/g);
				var date =  new Date(parts[0], parts[1]-1, parts[2]);
				var details = (event.details.length > trim) ? (event.details.substr(0, trim) + '...') : event.details;
				
				
				var item = {
					"title" : event.title,
					"start" : date.getTime(),
					"details" : details
				};
				eventsList.push( item );
			}
			
			// Sort Events
			eventsList.sort(function(a,b) {
				return a.start - b.start;
			});
	
			// Show Events
			$('#eventList').html('');
			for(var i = 0; i < eventsList.length && i < max_results; i++ ){
				var date =  new Date(eventsList[i].start);
				var day = date.getDate();
				var month = months[date.getMonth()];			
				$('<div class="event"><div class="date left"><div class="day">' + day + '</div><div class="month">' + month + '</div></div>' +
					'<div class="title">' + eventsList[i].title + '</div><div class="text">' + eventsList[i].details + '</div><div class="clear"></div></div>').appendTo(parent);
			}
		}
		else {
			parent.html("<b>NO FUTURE EVENTS</b>");
		}
		
	});
}

/** EMAIL **/
function sendEmail(){
    cname = $('#cf_name');
    $('#lb_name').removeClass('red');
    if (cname.val() == '') {
        cname.focus();
        $('#lb_name').addClass('red')
        return;
    }
    cemail = $('#cf_email');
    $('#lb_email').removeClass('red');
    if (cemail.val() == '' || !verifyEmailField(cemail.val())) {
        cemail.focus();
        $('#lb_email').addClass('red')
        return;
    }
    cmsg = $('#cf_msg');
    $('#lb_msg').removeClass('red');
    if (cmsg.val() == '') {
        cmsg.focus();
        $('#lb_msg').addClass('red')
        return;
    }
    csubject = $('#cf_subject');
    
    $('#cf_submit').hide();
    $('#cf_sending').show();
   	
   	var subject = "Novo contacto do site: " + csubject.val();
   	var body = "<b>Nome:</b> " + cname.val() + "<br/><b>Email:</b> " + cemail.val() + "<br/><b>Assunto:</b> " + csubject.val() + "<br/><br/>" + cmsg.val();   	

    $.post('http://www.projecto24.com/contacto/enviar/externo/', {
        subject: subject,
        from: cemail.val(),
        body: body,
        token: 12572394
    }, function(data){
		if( data == '0' ){
			alert('Message Sent. Thank You.');
			$('#contactForm input[type=text]').val('');
        	$('#contactForm textarea').val('');
		}
		else 
			alert('Message Failed. Please try again later.');
			
        $('#cf_submit').show();
    	$('#cf_sending').hide();
    });
}

function verifyEmailField(email){
    return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(email));
}
