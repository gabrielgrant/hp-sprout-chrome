
var CAMERA_PIXELS_PER_SCREEN_PIXEL = 4;
$(function(){
	$('.capture').click(function(){
		$.getJSON('http://localhost:55881/capture', function(data){
			console.log(data);
			data.forEach(function(i){
				var rawHeight = i.metadata.PhysicalBoundaries.Size.Height;
				var height = rawHeight * i.metadata.PixelDensity.Y / CAMERA_PIXELS_PER_SCREEN_PIXEL;
				var rawWidth = i.metadata.PhysicalBoundaries.Size.Height;
				var width = rawWidth * i.metadata.PixelDensity.X / CAMERA_PIXELS_PER_SCREEN_PIXEL;
				var imgStr = '<img src="' + i.imageData + '">';
				var imgEl = $(imgStr);
				imgEl.prop('height', height);
				imgEl.prop('width', width);
				console.log(imgEl);
				$('.vertical-display').append(imgEl);
				
				// set initial offset
				var rawX = i.metadata.PhysicalBoundaries.Location.X;
				var x = rawX * i.metadata.PixelDensity.X / CAMERA_PIXELS_PER_SCREEN_PIXEL;
				var rawY = i.metadata.PhysicalBoundaries.Location.Y;
				var y = rawY * i.metadata.PixelDensity.Y / CAMERA_PIXELS_PER_SCREEN_PIXEL;
				var transform = 'translate(' + x + 'px, ' + y + 'px)';
				var rawImgEl = imgEl.get(0);
				rawImgEl.style.webkitTransform = rawImgEl.style.transform = transform;

				// update the posiion attributes
				rawImgEl.setAttribute('data-x', x);
				rawImgEl.setAttribute('data-y', y);
				console.log(x, y);
				console.log(rawImgEl);
				console.log(rawImgEl === imgEl.get(0));
				interact(imgEl.get(0)).draggable({
					onmove: function(event){
						var target = event.target,
							// keep the dragged position in the data-x/data-y attributes
							x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
							y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

						// translate the element
						target.style.webkitTransform =
						target.style.transform =
							'translate(' + x + 'px, ' + y + 'px)';

						// update the posiion attributes
						target.setAttribute('data-x', x);
						target.setAttribute('data-y', y);
					}
				});
			});
		});
	});
});