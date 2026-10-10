---
title: MIDI player demo
---

A piano-roll player embedded with the `midi` tag. The piano loads automatically when a player enters the viewport. Press Play to listen.

{% midi /images/example.mid "Piano phrase" %}

A second player demonstrates independent seeking and automatic pause when another player starts.

{% midi /images/example.mid "Second player" %}

## Fixed width and height

A 640 px wide player with a total height of 400 px. The width shrinks to fit
narrow screens, and the piano roll fills the available height.

```text
{% midi /images/example.mid "Fixed size: 640 × 400" width=640 height=400 %}
```

{% midi /images/example.mid "Fixed size: 640 × 400" width=640 height=400 %}

## Percentage width

A player using 80% of the article width and a fixed height of 450 px.

```text
{% midi /images/example.mid "80% width, 450 px height" width=80% height=450 %}
```

{% midi /images/example.mid "80% width, 450 px height" width=80% height=450 %}

## Automatic height

A 480 px wide player whose height follows its content. Omitting both size
options, as in the first two examples, uses automatic width and height.

```text
{% midi /images/example.mid "480 px width, automatic height" width=480 height=auto %}
```

{% midi /images/example.mid "480 px width, automatic height" width=480 height=auto %}
