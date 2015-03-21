#!/usr/bin/perl -i.bak -ln
use strict;

	BEGIN { @ARGV = glob '*.glsl' }
	if (!/uniform float iGlobalTime/)
	{
		if ($. == 1)
		{
			print "uniform vec3 iResolution;";
			print "uniform number iGlobalTime;";
			print "uniform vec4 iLoc;";
			print "uniform number iChannelTime[4];";
			print "uniform vec3 iChannelResolution[4];";
			print "uniform sampler2D iChannel0;";
			print "uniform vec3 iMouse;";
			print "uniform vec4 iDate;";
		}
	}
	print or die "$ARGV: $!";
	close ARGV or die("$ARGV: $!") if eof;