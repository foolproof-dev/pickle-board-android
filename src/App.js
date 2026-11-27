import React, { useState, useEffect, useCallback } from 'react';
import RulesModal from './RulesModal';
import './RulesModal.css';
import { initAds, showInterstitialIfReady, showBanner, hideBanner, adsInfo } from './ads';
import { setupNative } from './native';

// --- 定数 ---
const INITIAL_SCORES = { teamA: 0, teamB: 0 };
const WINNING_SCORE = 11;

const numberToWord = (num) => {
  const words = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four',
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine',
    10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen',
    14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen',
    18: 'eighteen', 19: 'nineteen', 20: 'twenty',
  };
  return words[num] || String(num);
};

// --- メインコンポーネント ---
function App() {
  // --- 状態管理 ---
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [gameScores, setGameScores] = useState(INITIAL_SCORES);
  const [servingTeam, setServingTeam] = useState(null);
  const [serverNumber, setServerNumber] = useState(1); // 内部ロジック用 (1 or 2)
  const [isFirstServeOfGame, setIsFirstServeOfGame] = useState(true); // ゲーム最初のサーブか
  const [winner, setWinner] = useState(null);
  const [teamNames, setTeamNames] = useState({ teamA: 'Team A', teamB: 'Team B' });
  const [editing, setEditing] = useState({ teamA: false, teamB: false });
  const [history, setHistory] = useState([]);
  const [gameState, setGameState] = useState('not_started'); // not_started, in_progress, finished
  const [matchFirstServer, setMatchFirstServer] = useState(null); // 試合の最初のサーバーを記録
  const [currentGameInitialServer, setCurrentGameInitialServer] = useState(null); // 現在のゲームの最初のサーバー
  const [showRulesModal, setShowRulesModal] = useState(false); // New state for modal
  const [displayMode, setDisplayMode] = useState('normal'); // 'normal' or 'scoreboard'

  const checkWinner = useCallback(() => {
    const { teamA, teamB } = scores;
    if (teamA >= WINNING_SCORE && teamA >= teamB + 2) {
      setWinner('teamA');
      setGameScores(prev => ({ ...prev, teamA: prev.teamA + 1 }));
      setGameState('finished');
    } else if (teamB >= WINNING_SCORE && teamB >= teamA + 2) {
      setWinner('teamB');
      setGameScores(prev => ({ ...prev, teamB: prev.teamB + 1 }));
      setGameState('finished');
    }
  }, [scores]);

  // New functions for modal
  const handleShowRulesModal = () => setShowRulesModal(true);
  const handleCloseRulesModal = () => setShowRulesModal(false);

  // Display mode toggle
  const toggleDisplayMode = () => {
    setDisplayMode(prev => prev === 'normal' ? 'scoreboard' : 'normal');
  };

  // --- 副作用 ---
  useEffect(() => {
    if (gameState === 'in_progress') {
      checkWinner();
    }
  }, [scores, checkWinner, gameState]);

  // ネイティブ機能（画面常時ON等）と広告SDKの初期化（起動時に1回）
  useEffect(() => {
    setupNative();
    initAds();
  }, []);

  // 1ゲーム終了時にインタースティシャル広告を表示
  // （Winner 表示を一瞬見せてから全画面広告を出す）
  useEffect(() => {
    if (gameState !== 'finished') return undefined;
    const timer = setTimeout(() => {
      showInterstitialIfReady();
    }, 1200);
    return () => clearTimeout(timer);
  }, [gameState]);

  // バナー広告：通常モードのみ表示、得点盤モードでは非表示
  useEffect(() => {
    if (displayMode === 'scoreboard') {
      hideBanner();
    } else {
      showBanner();
    }
  }, [displayMode]);

  // --- 主要ロジック ---
  const handlePoint = (winningTeam) => {
    if (gameState !== 'in_progress') return;

    // 現在の状態を履歴に保存
    setHistory(prevHistory => [...prevHistory, {
      scores,
      gameScores,
      servingTeam,
      serverNumber,
      isFirstServeOfGame,
      winner,
      gameState,
      matchFirstServer,
      currentGameInitialServer,
    }]);

    if (winningTeam === servingTeam) {
      // サーブ側がポイント
      setScores(prev => ({ ...prev, [winningTeam]: prev[winningTeam] + 1 }));
    } else {
      // サーブ側がフォルト
      if (isFirstServeOfGame) {
        // ゲーム最初のサーブでのフォルトは即サイドアウト
        setServingTeam(winningTeam);
        setServerNumber(1);
        setIsFirstServeOfGame(false); // 特別ルール終了
      } else if (serverNumber === 1) {
        // 通常時のサーバー1のフォルト
        setServerNumber(2);
      } else {
        // 通常時のサーバー2のフォルトでサイドアウト
        setServingTeam(winningTeam);
        setServerNumber(1);
      }
    }
  };

  const handleSelectFirstServer = (team) => {
    // 試合の最初のサーブの場合のみ設定
    if (!matchFirstServer) {
      setMatchFirstServer(team);
    }
    setCurrentGameInitialServer(team);
    setServingTeam(team);
    setGameState('in_progress');
  };

  // --- リセット・Undoロジック ---
  const handleUndo = () => {
    if (history.length === 0) return;

    const lastState = history[history.length - 1];
    setScores(lastState.scores);
    setGameScores(lastState.gameScores);
    setServingTeam(lastState.servingTeam);
    setServerNumber(lastState.serverNumber);
    setIsFirstServeOfGame(lastState.isFirstServeOfGame);
    setWinner(lastState.winner);
    setGameState(lastState.gameState);
    setMatchFirstServer(lastState.matchFirstServer);
    setCurrentGameInitialServer(lastState.currentGameInitialServer);

    setHistory(prevHistory => prevHistory.slice(0, -1));
  };

  // ゲームの状態を完全に初期化する
  const resetFullGame = () => {
    setScores(INITIAL_SCORES);
    setWinner(null);
    setServingTeam(null);
    setServerNumber(1);
    setIsFirstServeOfGame(true);
    setHistory([]);
    setGameState('not_started');
  };

  const handleResetCurrentGameClick = () => {
    if (!currentGameInitialServer) {
      resetFullGame();
    } else {
      setScores(INITIAL_SCORES);
      setWinner(null);
      setHistory([]);
      setIsFirstServeOfGame(true);
      setServerNumber(1);
      setServingTeam(currentGameInitialServer);
      setGameState('in_progress');
    }
  };

  const handleNewGame = () => {
    resetFullGame();
    setGameScores(INITIAL_SCORES);
    setMatchFirstServer(null);
    setCurrentGameInitialServer(null);
  };

  const handleAnnounceScore = () => {
    if (!servingTeam || gameState !== 'in_progress') return;

    const serverScore = scores[servingTeam];
    const receiverTeam = servingTeam === 'teamA' ? 'teamB' : 'teamA';
    const receiverScore = scores[receiverTeam];
    const announcedServerNumber = isFirstServeOfGame ? 2 : serverNumber;

    const serverScoreWord = numberToWord(serverScore);
    const receiverScoreWord = numberToWord(receiverScore);
    const serverNumberWord = numberToWord(announcedServerNumber);

    const utterance = new SpeechSynthesisUtterance(`${serverScoreWord} ${receiverScoreWord} ${serverNumberWord}`);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  // 次のゲームを開始する
  const startNextGame = () => {
    const totalGames = gameScores.teamA + gameScores.teamB;
    const nextServer = (totalGames % 2 === 0)
      ? matchFirstServer
      : (matchFirstServer === 'teamA' ? 'teamB' : 'teamA');

    setScores(INITIAL_SCORES);
    setWinner(null);
    setHistory([]);
    setIsFirstServeOfGame(true);
    setServerNumber(1);

    // 次のゲームのサーバーをセットして開始
    setCurrentGameInitialServer(nextServer);
    setServingTeam(nextServer);
    setGameState('in_progress');
  };

  // --- チーム名編集ロジック ---
  const handleNameChange = (team, newName) => {
    setTeamNames(prev => ({ ...prev, [team]: newName }));
  };

  const handleNameClick = (team) => {
    setEditing(prev => ({ ...prev, [team]: true }));
  };

  const handleNameBlur = (team) => {
    setEditing(prev => ({ ...prev, [team]: false }));
  };

  // --- レンダリング --- 
  const renderTeamArea = (teamId) => {
    const isServing = servingTeam === teamId && gameState === 'in_progress';
    const teamName = teamNames[teamId];
    const displayServerNumber = isFirstServeOfGame ? 2 : serverNumber;

    return (
      <div className={`col-md-6 text-center team-area ${isServing ? 'serving' : ''}`}>
        <div>
          {editing[teamId] ? (
            <input
              type="text"
              value={teamName}
              onChange={(e) => handleNameChange(teamId, e.target.value)}
              onBlur={() => handleNameBlur(teamId)}
              autoFocus
              className="team-name-input"
            />
          ) : (
            <h2 className="team-name" onClick={() => handleNameClick(teamId)}>{teamName}</h2>
          )}
          <p className="score-display">{scores[teamId]}</p>
          <p className="server-number">{isServing ? `Server #${displayServerNumber}` : ''}</p>
        </div>
        <button
          className="btn btn-primary point-button mt-auto"
          onClick={() => handlePoint(teamId)}
          disabled={gameState !== 'in_progress'}
        >
          POINT
        </button>
      </div>
    );
  };

  const renderServerSelection = () => (
    <div className="text-center p-5">
      <h2 className="mb-4">Who serves first?</h2>
      <div className="row justify-content-center">
        <div className="col-md-5 text-center mb-3">
          {editing.teamA ? (
            <input
              type="text"
              value={teamNames.teamA}
              onChange={(e) => handleNameChange('teamA', e.target.value)}
              onBlur={() => handleNameBlur('teamA')}
              autoFocus
              className="team-name-input form-control-lg mb-2"
            />
          ) : (
            <h3 className="team-name" onClick={() => handleNameClick('teamA')} style={{ cursor: 'pointer' }}>
              {teamNames.teamA}
            </h3>
          )}
          <button className="btn btn-lg btn-success" onClick={() => handleSelectFirstServer('teamA')}>
            Select to Serve
          </button>
        </div>
        <div className="col-md-5 text-center mb-3">
          {editing.teamB ? (
            <input
              type="text"
              value={teamNames.teamB}
              onChange={(e) => handleNameChange('teamB', e.target.value)}
              onBlur={() => handleNameBlur('teamB')}
              autoFocus
              className="team-name-input form-control-lg mb-2"
            />
          ) : (
            <h3 className="team-name" onClick={() => handleNameClick('teamB')} style={{ cursor: 'pointer' }}>
              {teamNames.teamB}
            </h3>
          )}
          <button className="btn btn-lg btn-success" onClick={() => handleSelectFirstServer('teamB')}>
            Select to Serve
          </button>
        </div>
      </div>
    </div>
  );

  // --- 得点盤モードのレンダリング ---
  const renderScoreboardMode = () => {
    const displayServerNumber = isFirstServeOfGame ? 2 : serverNumber;

    const renderScoreboardTeam = (teamId, position) => {
      const isServing = servingTeam === teamId && gameState === 'in_progress';

      return (
        <div className={`scoreboard-team-area ${isServing ? 'scoreboard-serving' : ''}`}>
          <div className="scoreboard-score-container">
            <div className="scoreboard-score">{scores[teamId]}</div>
            {isServing && (
              <div className="scoreboard-server-number">
                {displayServerNumber}
              </div>
            )}
          </div>
          <button
            className={`scoreboard-point-button scoreboard-point-button-${position}`}
            onClick={() => handlePoint(teamId)}
            disabled={gameState !== 'in_progress'}
          >
            +
          </button>
        </div>
      );
    };

    return (
      <div className="scoreboard-mode">
        <div className="scoreboard-header">
          <div className="scoreboard-game-score">
            {teamNames.teamB}: {gameScores.teamB} - {gameScores.teamA} : {teamNames.teamA}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="btn btn-info scoreboard-announce-button" onClick={handleAnnounceScore}>
              🔊
            </button>
            <button className="btn btn-warning scoreboard-mode-toggle" onClick={toggleDisplayMode}>
              📊
            </button>
          </div>
        </div>

        {gameState === 'not_started' ? (
          <div className="scoreboard-start-message">
            <h2>Please select first server in normal mode</h2>
            <button className="btn btn-lg btn-primary mt-3" onClick={toggleDisplayMode}>
              Go to Normal Mode
            </button>
          </div>
        ) : (
          <div className="scoreboard-teams">
            {renderScoreboardTeam('teamB', 'left')}
            <div className="scoreboard-divider"></div>
            {renderScoreboardTeam('teamA', 'right')}
          </div>
        )}

        {gameState === 'finished' && (
          <div className="scoreboard-winner-overlay">
            <h2>{teamNames[winner]} Wins!</h2>
            <button className="btn btn-success btn-lg mt-3" onClick={startNextGame}>
              Start Next Game
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`App container py-4 ${adsInfo.isNative && displayMode === 'normal' ? 'has-banner' : ''}`}>
      {displayMode === 'scoreboard' ? (
        renderScoreboardMode()
      ) : (
        <>
          <header className="text-center my-4 position-relative">
            <h1 className="title">pickle-board</h1>
            <div className="rules-button-container">
              <button className="btn btn-info rules-button" onClick={handleShowRulesModal}>
                ?
              </button>
            </div>
            <div className="mode-toggle-container">
              <button className="btn btn-warning mode-toggle-button" onClick={toggleDisplayMode}>
                📊
              </button>
            </div>
          </header>

          <main>
            <div className="row mb-3">
              <div className="col text-center">
                <p className="game-score">
                  {teamNames.teamA}: {gameScores.teamA} - {gameScores.teamB} : {teamNames.teamB}
                </p>
              </div>
            </div>

            <div className="row team-row" style={{ minHeight: '400px' }}>
              {gameState === 'not_started' ? renderServerSelection() : (
                <>
                  {renderTeamArea('teamA')}
                  {renderTeamArea('teamB')}
                </>
              )}
            </div>

            {gameState === 'finished' && (
              <div className="alert alert-success text-center mt-4" role="alert">
                <h4>{teamNames[winner]} Wins the Game!</h4>
                <button className="btn btn-success mt-2" onClick={startNextGame}>
                  Start Next Game
                </button>
              </div>
            )}
          </main>

          <footer className="text-center mt-4 control-buttons">
            <button
              className="btn btn-info me-2"
              onClick={handleUndo}
              disabled={history.length === 0}
            >
              Undo
            </button>
            <button className="btn btn-secondary me-2" onClick={handleResetCurrentGameClick}>
              Reset Current Game
            </button>
            <button className="btn btn-danger me-2" onClick={handleNewGame}>
              New Game
            </button>
            <button className="btn btn-success me-2" onClick={handleAnnounceScore}>
              Announce Score
            </button>
          </footer>

          {/* Render the RulesModal */}
          <RulesModal show={showRulesModal} handleClose={handleCloseRulesModal} />
        </>
      )}
    </div>
  );
}

export default App;
