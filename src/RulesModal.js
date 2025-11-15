import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
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
              <li><a href="#scoring" onClick={(e) => { e.preventDefault(); scrollToSection('scoring'); }}>2. スコア</a></li>
              <li><a href="#serving" onClick={(e) => { e.preventDefault(); scrollToSection('serving'); }}>3. サーブ</a></li>
              <li><a href="#twoBounce" onClick={(e) => { e.preventDefault(); scrollToSection('twoBounce'); }}>4. ツーバウンドルール</a></li>
              <li><a href="#kitchen" onClick={(e) => { e.preventDefault(); scrollToSection('kitchen'); }}>5. ノンボレーゾーン（キッチン）</a></li>
              <li><a href="#faults" onClick={(e) => { e.preventDefault(); scrollToSection('faults'); }}>6. フォルト（反則）</a></li>
            </ul>
          </nav>

          {/* Rules Sections */}
          <section id="basics" ref={sectionRefs.basics} className="rule-section">
            <h3>1. 基本</h3>
            <h4>ゲームの目的</h4>
            <p>ピックルボールはテニス、バドミントン、卓球の要素を組み合わせたパドルスポーツです。ボールをネット越しに打ち、相手が合法的に返球できないようにすることが目的です。</p>
            <h4>コートのレイアウト</h4>
            <p>[コート図]</p>
            {/* Placeholder for image */}
            <div className="image-placeholder">コート図のプレースホルダー</div>
          </section>

          <section id="scoring" ref={sectionRefs.scoring} className="rule-section">
            <h3>2. スコア</h3>
            <h4>得点の入り方</h4>
            <p>サーブ側のチームのみが得点できます。相手がフォルトした場合に得点が入ります。</p>
            <h4>ゲームの勝利条件</h4>
            <p>ゲームは通常11点先取です。2点差をつけて勝つ必要があります。スコアが10-10で同点の場合、どちらかのチームが2点差をつけるまでプレーを続けます。</p>
            <h4>スコアのコール方法（ダブルス）</h4>
            <p>サーブの前にスコアをコールします。通常、サーブ側のチームのスコア、相手チームのスコア、そしてサーバーの番号（1番目または2番目のサーバー）の順にコールします。</p>
          </section>

          <section id="serving" ref={sectionRefs.serving} className="rule-section">
            <h3>3. サーブ</h3>
            <h4>サーブの打ち方（アンダーハンド）</h4>
            <p>サーブはアンダーハンドで、パドルが腰より下でボールに接触するように打ちます。ボールを落として打つか、トスして打つことができます。</p>
            {/* Placeholder for image */}
            <div className="image-placeholder">アンダーハンドサーブのイラストプレースホルダー</div>
            <h4>サーブの順番（ダブルス）</h4>
            <p>ゲームの最初のサーブは右側のサービスコートから行われます。最初のフォルトの後、サーブ側のチームの2番目のプレイヤーがサーブします。2番目のフォルトの後、サイドアウトとなります。</p>
            <h4>サーブを入れる場所</h4>
            <p>サーブは対角線上の相手サービスコート内に着地し、ノンボレーゾーン（キッチン）を越える必要があります。</p>
            {/* Placeholder for image */}
            <div className="image-placeholder">対角線上のサーブ経路図のプレースホルダー</div>
            <h4>レットサーブ</h4>
            <p>サーブがネットに触れても、正しいサービスコート内に着地した場合、「レット」となり、やり直します。</p>
          </section>

          <section id="twoBounce" ref={sectionRefs.twoBounce} className="rule-section">
            <h3>4. ツーバウンドルール</h3>
            <h4>ルールの説明</h4>
            <p>サーブの後、ボールはレシーブ側のチームのコートで一度バウンドしなければなりません。その後、サーブ側のチームは返球が自分たちのコートで一度バウンドするのを待たなければなりません。この2回のバウンドの後、プレイヤーはバウンドしたボールを打つか、ボレー（バウンドする前に空中で打つ）することができます。</p>
            {/* Placeholder for image */}
            <div className="image-placeholder">ツーバウンドルールのシーケンス図のプレースホルダー</div>
          </section>

          <section id="kitchen" ref={sectionRefs.kitchen} className="rule-section">
            <h3>5. ノンボレーゾーン（キッチン）</h3>
            <h4>それが何であるか</h4>
            <p>これはネットの両側にある7フィートのエリアです。</p>
            <h4>キッチンでのルール</h4>
            <p>プレイヤーは、ノンボレーゾーン内に立っている間、またはボレー後に勢いでゾーン内に入った場合、ボールをボレー（空中で打つ）することはできません。ただし、ボールがゾーン内でバウンドした場合は、キッチンに入って打つことができます。</p>
            {/* Placeholder for image */}
            <div className="image-placeholder">キッチンでのフォルトを示す図のプレースホルダー</div>
          </section>

          <section id="faults" ref={sectionRefs.faults} className="rule-section">
            <h3>6. フォルト（反則）</h3>
            <h4>主なフォルト</h4>
            <p>ルール違反があった場合、フォルトとなり、ラリーを失います。主なフォルトには、アウトオブバウンズ、ネットイン、ネットを越えなかった場合などがあります。</p>
            <h4>ノンボレーゾーンでのフォルト</h4>
            <p>キッチン内でボレーしたり、ボレー後に勢いでキッチンに足を踏み入れたりした場合。</p>
            <h4>サーブでのフォルト</h4>
            <p>サーブがアウトオブバウンズ、ネットイン、または正しいサービスコート内に着地しなかった場合。</p>
          </section>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          閉じる
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RulesModal;
