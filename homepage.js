// Connect product navigation to the existing preview keyboard.
document.querySelectorAll('[data-open-keyboard]').forEach(trigger=>{
  trigger.addEventListener('click',event=>{
    event.preventDefault();
    const toggle=document.querySelector('#fontCard .virtual-keyboard-toggle');
    if(toggle?.getAttribute('aria-expanded')==='false')toggle.click();
    document.getElementById('stage').scrollIntoView({block:'start'});
    document.getElementById('input').focus({preventScroll:true});
  });
});
