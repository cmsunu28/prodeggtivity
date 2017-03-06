// Saves options to chrome.storage
function save_options() {
  console.log("saving options...")
  var productive = document.getElementById('Productive').value;
  var unproductive = document.getElementById('Unproductive').value;
  var tokenval = document.getElementById('token').value;
  var deviceval = document.getElementById('device').value;
  chrome.storage.sync.set({
    worktabs: productive,
    playtabs: unproductive,
    token: tokenval,
    device: deviceval
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });


}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    worktabs: 'mail.google.com\ntodoist.com\ncalendar.google.com\nbuild.particle.io\ndocs.particle.io',
    playtabs: 'reddit.com\nfacebook.com\nbuzzfeed.com\nnetflix.com',
    token: '<enter your user token here>',
    device: '<enter your device id here>'
  }, function(items) {
    document.getElementById('Productive').value = items.worktabs;
    document.getElementById('Unproductive').value = items.playtabs;
    document.getElementById('token').value=items.token;
    document.getElementById('device').value=items.device;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);