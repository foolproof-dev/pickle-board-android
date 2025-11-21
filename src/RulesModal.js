import React, { useRef } from 'react';
import { Modal } from 'react-bootstrap';
import './RulesModal.css'; // スタイルシートをインポート

const RulesModal = ({ show, handleClose }) => {
  const sectionRefs = {
    basics: useRef(null),
    scoring: useRef(null),
    serving: useRef(null),
    twoBounce: useRef(null),
    kitchen: useRef(null),
    faults: useRef(null),
  };

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId].current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Pickleball Rules</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="rules-container">
          {/* Table of Contents */}
          <nav className="table-of-contents mb-4">
            <h4>目次</h4>
            <ul>
              <li><a href="#basics" onClick={(e) => { e.preventDefault(); scrollToSection('basics'); }}>1. 基本</a></li>
              <li><a href="#scoring" onClick={(e) => { e.preventDefault(); scrollToSection('scoring'); }}>2. スコアのルール</a></li>
              <li><a href="#serving" onClick={(e) => { e.preventDefault(); scrollToSection('serving'); }}>3. サーブのルール</a></li>
              <li><a href="#twoBounce" onClick={(e) => { e.preventDefault(); scrollToSection('twoBounce'); }}>4. ツーバウンドルール</a></li>
              <li><a href="#kitchen" onClick={(e) => { e.preventDefault(); scrollToSection('kitchen'); }}>5. ノンボレーゾーン（キッチン）</a></li>
              <li><a href="#faults" onClick={(e) => { e.preventDefault(); scrollToSection('faults'); }}>6. フォルト（反則）</a></li>
            </ul>
          </nav>

          {/* Rules Sections */}
          <section id="basics" ref={sectionRefs.basics} className="rule-section">
            <h3>1. 基本</h3>
            <p>ピックルボールは、テニス、バドミントン、卓球の要素を組み合わせたスポーツです。ボールをネット越しに打ち合い、相手が返球できなくなるとポイントが入ります。</p>
            <img src="/images/court-layout.png" alt="Pickleball Court Layout" className="img-fluid mb-3" />
          </section>

          <section id="scoring" ref={sectionRefs.scoring} className="rule-section">
            <h3>2. スコアのルール</h3>
            <h4>得点方法</h4>
            <p>ポイントはサーブ権を持っている側（サービングチーム）にのみ入ります。相手チームがフォルト（反則）をすると、サービングチームに1点が入ります。</p>
            <h4>勝利条件</h4>
            <p>通常、1ゲームは11点先取で勝利となります。ただし、必ず2点差以上をつける必要があります（例: 11-9, 12-10）。</p>
            <h4>スコアのコール</h4>
            <p>サーバーはサーブを打つ前に、必ずスコアをコールします。コールは「自分のチームの点数 → 相手チームの点数 → サーバー番号（1 or 2）」の順で行います。</p>
            <p class="small text-muted">例: "eight three two" (8 - 3 で、2人目のサーバー)</p>
          </section>

          <section id="serving" ref={sectionRefs.serving} className="rule-section">
            <h3>3. サーブのルール</h3>
            <h4>サーブの基本</h4>
            <ul>
              <li>サーブは必ずアンダーハンドで打ちます。</li>
              <li>打つ瞬間、パドルの面は手首より下にある必要があります。</li>
              <li>ボールを打つ位置は、腰よりも下でなければなりません。</li>
              <li>サーバーはベースラインの後ろから、対角線上にある相手コートのサービスコート（キッチンの後ろ）を狙ってサーブを打ちます。</li>
              <li>サーブ権は1回のみです。</li>
            </ul>
            <img src="/images/serve-motion.png" alt="Underhand Serve Motion" className="img-fluid mb-3" />
            <h4>サーバーの交代（ダブルス）</h4>
            <p>各チームはサイドアウトするまで2回のサーブ権を持ちます（1人目と2人目のサーバー）。ただし、ゲーム開始時の最初のサーブ権だけは、1人目のサーバーがフォルトした時点でサイドアウト（相手チームにサーブ権が移動）となります。</p>
            <h4>サーブがネットに当たった場合</h4>
            <p>サーブがネットに触れて、そのまま相手の正しいサービスコートに入った場合はプレー続行となります。</p>
          </section>

          <section id="twoBounce" ref={sectionRefs.twoBounce} className="rule-section">
            <h3>4. ツーバウンドルール</h3>
            <p>これはピックルボールの最もユニークなルールの一つです。</p>
            <p>「サーブされたボール」と「その次の返球」は、必ずそれぞれ1回ずつ地面でバウンドさせてから打たなければなりません。この2回のバウンドが終わった後は、ノーバウンド（ボレー）で打ち返すことが許可されます。</p>
          </section>

          <section id="kitchen" ref={sectionRefs.kitchen} className="rule-section">
            <h3>5. ノンボレーゾーン（キッチン）</h3>
            <h4>キッチンとは？</h4>
            <p>ネットの両側に広がる幅2.13mのエリアです。コート上のラインもキッチンの一部とみなされます。</p>
            <h4>キッチンでのルール</h4>
            <p>プレイヤーは、キッチン内に足を踏み入れた状態でボールをノーバウンドで打つ（ボレーする）ことはできません。ボレーをした後、その勢いでキッチン内に足を踏み入れてもフォルトとなります。</p>
            <p>ただし、ボールがキッチン内で一度バウンドした場合は、キッチン内に入って打ち返すことができます。</p>
          </section>

          <section id="faults" ref={sectionRefs.faults} className="rule-section">
            <h3>6. フォルト（反則）</h3>
            <p>フォルトをすると、ラリーは終了します。サーブ側がフォルトした場合はサーバーが交代またはサイドアウトし、レシーブ側がフォルトした場合はサーブ側の得点となります。</p>
            <h4>主なフォルト</h4>
            <ul>
              <li>ツーバウンドルールを守らなかった場合。</li>
              <li>キッチン内でボレーした場合、またはボレー後にキッチンに足を踏み入れた場合。</li>
              <li>サーブが正しいサービスコートに入らなかった場合。</li>
              <li>打ったボールがネットを越えなかった場合。</li>
              <li>打ったボールが相手コートのライン外（アウト）に着地した場合。</li>
            </ul>
          </section>
        </div>
      </Modal.Body>

    </Modal>
  );
};

export default RulesModal;
