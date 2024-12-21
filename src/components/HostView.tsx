import React, { useState, useEffect, useRef } from 'react';
import { Play, Eye, Trophy } from 'lucide-react';
import QuestionCard from './QuestionCard';
import PlayerList from './PlayerList';
import MapComponent from './MapComponent';
import { calculateBounds } from '../lib/mapUtils';
import type { MapRef } from '../types/map';

// ... (keep existing interfaces)

export default function HostView({
  gameId,
  currentQuestion,
  players,
  answers: propAnswers,
  onNextQuestion,
  onRevealAnswers,
  question
}: HostViewProps) {
  // ... (keep existing state)

  // Handle reveal state
  useEffect(() => {
    if (showingAnswers) {
      console.log('Revealing answers:', {
        currentQuestion,
        totalAnswers: propAnswers.length,
        question,
        allAnswers: propAnswers
      });

      // Add correct answer first
      const correctAnswer = {
        id: 'correct',
        player_id: 'correct',
        game_id: gameId,
        question_id: currentQuestion,
        latitude: question.latitude,
        longitude: question.longitude,
        distance: 0,
        score: 1000
      };

      // Filter answers for current question
      const relevantAnswers = propAnswers.filter(answer => {
        // Both currentQuestion and question_id are zero-based
        const isRelevant = answer.question_id === currentQuestion;
        console.log('Filtering answer:', {
          answerId: answer.id,
          questionId: answer.question_id,
          currentQuestion,
          isRelevant,
          playerId: answer.player_id,
          player: players.find(p => p.id === answer.player_id)?.initials
        });
        return isRelevant;
      });

      console.log('Filtered answers:', {
        total: relevantAnswers.length,
        answers: relevantAnswers.map(a => ({
          id: a.id,
          player: players.find(p => p.id === a.player_id)?.initials,
          score: a.score
        }))
      });
      
      // Set all answers at once
      setDisplayedAnswers([correctAnswer, ...relevantAnswers]);
      setRevealComplete(true);

      // Fit map to show all points
      if (mapRef.current && relevantAnswers.length > 0) {
        const points = [
          [question.longitude, question.latitude],
          ...relevantAnswers.map(a => [a.longitude, a.latitude])
        ];
        
        const bounds = calculateBounds(points);
        console.log('Fitting to bounds:', bounds);
        
        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 2000
        });
      }
    }
  }, [showingAnswers, propAnswers, currentQuestion, question, gameId, players]);

  // ... (keep rest of the component the same)
}