Rafeeq.initGallery=()=>{
 const dialog=document.querySelector('#gallery'),img=document.querySelector('#gallery-image');let images=[],index=0,zoom=1,opener;
 const show=()=>{img.src=images[index].src;img.alt=images[index].caption||'Dataset evidence';img.style.transform=`scale(${zoom})`;document.querySelector('#zoom-label').textContent=Math.round(zoom*100)+'%';document.querySelector('#gallery-caption').textContent=`${index+1} / ${images.length} · ${images[index].caption||''}`;dialog.querySelectorAll('[data-gallery="prev"],[data-gallery="next"]').forEach(b=>b.disabled=images.length<2);};
 const action=a=>{if(a==='close'){dialog.close();return;}if(a==='prev'||a==='next'){index=(index+(a==='next'?1:-1)+images.length)%images.length;zoom=1;}if(a==='in')zoom=Math.min(zoom+.25,4);if(a==='out')zoom=Math.max(zoom-.25,.25);show();};
 Rafeeq.openGallery=(list,i=0)=>{if(!list.length)return;images=list;index=i;zoom=1;opener=document.activeElement;show();dialog.showModal()};
 dialog.querySelectorAll('[data-gallery]').forEach(b=>b.onclick=()=>action(b.dataset.gallery));dialog.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','+','-'].includes(e.key)){e.preventDefault();action({'ArrowLeft':'prev','ArrowRight':'next','+':'in','-':'out'}[e.key])}});dialog.addEventListener('close',()=>opener?.focus());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
};
