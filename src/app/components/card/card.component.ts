import { Component, Input, OnInit } from '@angular/core';
import { DOMAIN } from 'src/app/util/theme';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  cardItems = [
    {
      id: 1,
      title: 'Free SMS & Chat',
      description: 'An important facility such as chat is available in our site, so that people can interact with each other.',
      icon: ''
    },
    {
      id: 2,
      title: 'Auto Match Maker',
      description: 'Some new members get registered daily. This matrimony system updates and shows you matched profile.',
      icon: ''
    },
    {
      id: 3,
      title: 'Recommend Profile',
      description: 'when you follow some-one, you can see the updates of people whom you follow.',
      icon: ''
    },
    {
      id: 4,
      title: 'Notification Alerts',
      description: 'The activities such as changing the display picture, birthday notification, photo requests.',
      icon: ''
    },
    {
      id: 5,
      title: 'Restrictions Setting',
      description: 'Restrictions Enable Copying Photos & Video Disable Anti Spam System Provided.',
      icon: ''
    },
  ];

  domain = DOMAIN;
  constructor() { }

  ngOnInit() { }

}
