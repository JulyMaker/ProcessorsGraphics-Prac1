num = 0
Dir.glob('*.frag') do |file|
	text = File.read(file)
	if  (not text =~ /uniform float iGlobalTime/)
		num = num + 1
		puts "Converting: " + file
		text = "uniform vec4 iDate; \n" + text
		text = "uniform vec3 iMouse; \n" + text
		text = "uniform sampler2D iChannel0; \n" + text
		text = "uniform vec3 iChannelResolution[4]; \n" + text
		text = "uniform float iChannelTime[4]; \n" + text
		text = "uniform vec4 iLoc; \n" + text
		text = "uniform float iGlobalTime; \n" + text
		text = "uniform vec3 iResolution; \n" + text
		File.open(file, "w") {|file| file.write(text)}
	end
end
if (num > 0)
puts "All done, press any key to exit"
else
puts "no files converted, press any key to exit"
end
gets.chomp