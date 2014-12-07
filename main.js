
var CAMERA_PIXELS_PER_SCREEN_PIXEL = 4;
function applyTransform(e){
	var e = $(e);
	var x = e.data('x')|| 0;
	var y = e.data('y')|| 0;
	var scale = e.data('scale')|| 1;
	console.log(e.data('x'), x);
	console.log(scale, x, y);
	var transform = 'matrix(' + [scale, 0, 0, scale, x, y].join(', ') + ')';
	console.log(transform);
	e.css({
	  '-webkit-transform' : transform,
	  '-moz-transform'    : transform,
	  '-ms-transform'     : transform,
	  '-o-transform'      : transform,
	  'transform'         : transform
	});
}
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
				imgEl.data('x', x);
				imgEl.data('y', y);
				applyTransform(imgEl);
				interact(imgEl.get(0)).draggable({
					onmove: function(event){
						var target = event.target,
							// keep the dragged position in the data-x/data-y attributes
							x = ($(target).data('x') || 0) + event.dx,
							y = ($(target).data('y') || 0) + event.dy;
						// update the position attributes
						$(target).data('x', x);
						$(target).data('y', y);
						console.log(target);
						applyTransform(target);
					}
				})
				.inertia(true)
				.restrict({
					drag: "parent",
					endOnly: true,
					elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
				})
				.gesturable({
					onmove: function(event){
						var target = event.target;
						var scale = ($(target).data('scale') || 1) + event.ds;
						$(target).data('scale', scale);
						target.style.webkitTransform =
						applyTransform(target);
					}
				});
			});
		});
	});
});