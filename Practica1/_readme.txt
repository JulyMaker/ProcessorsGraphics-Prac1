Shadorz, real-time fragment shader editing software
by NMZ (stormoid.com)

Version 1.0.3
Changes:
	-Minor bugfixes
	-Fixed config file parsing
	-Added warning if shaders folder is empty

This software is freeware.
Rebranding,Reselling or Appropriation of this software is prohibited.



Features:
-The program will display shaders found in the specified shader directory (shaders by default)
-Clicking on a shader will maximize it
-Once maximized you can edit (opens default editor), fork, rename the shader
-Any edits to a maximized shader will be automatically updated in the software
-You can add textures to the texture directory (tex by default) and use "t" while running to switch textures
-You can export abitrary sized screenshots of any shader, up to the maximum your gpu support (tested with up to 16,000x16,000 pixel images)
-Png encoding is done in a separate thread so you can keep working while encoding
-Support for arbitrary "post-scaling" of shaders
-Arbitrarily resizable window and fullscreen support (alt+enter to toggle)
-Uniforms compatible with shadertoy.com with an extra "Location" vec3 uniform for precise positional control
-Modify config.txt to change directory names, shaders per page and default window size
-The file handling features (renaming, deleting, forking, newing) will only be avaible if the program is run in admin mode


Technical Details:
-the glsl version is 1.2
-Vsync is disabled
-the framerate is fixed at ~60fps in code as to not fry your gpu


Press F1 when the program is running to see commands.


--------------------------------------------------------
Made possible by the use love2d and many other libraries, see license.txt for information