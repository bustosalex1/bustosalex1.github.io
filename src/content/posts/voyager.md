---
title: 'Voyager 1 Trajectory Simulation'
pubDate: 2020-04-01
description: 'Not exactly high-fidelity.'
author: 'Alex Bustos'
image: '../../assets/3Dprinter_thumbnail-01.png'
imageAlt: 'Demo image.'
project: true
tags: ['3D printing', 'CAD']
---

This was part of an extra credit problem for my Spacecraft Flight Dynamics class. The prompt was to pick an interplanetary spacecraft and simulate its orbit using MATLAB and then visualize the results. I had fun with the problem, so I figured I would share some of the results.

After choosing to simulate Voyager 1's trajectory out of the solar system, I opted for the patched conics approach and divided the trajectory intermediate stages, including each of the spacecraft's planetary flybys and its sun-centered cruises. For each of the stages, I gathered initial values from [NASA JPL's HORIZONS tool](https://ssd.jpl.nasa.gov/horizons.cgi). I supplied the two body equation with these inital values and simulated each stage using MATLAB's ode45 function. The slideshow shows the final result of the simulations. Some of the graphs may be hard to see, so feel free to click on any one to get a larger, higher-definition image.