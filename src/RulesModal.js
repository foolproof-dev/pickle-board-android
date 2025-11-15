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
              <li><a href="#scoring" onClick={(e) => { e.preventDefault(); scrollToSection('scoring'); }}>2. スコア</a></li>
              <li><a href="#serving" onClick={(e) => { e.preventDefault(); scrollToSection('serving'); }}>3. サーブ</a></li>
              <li><a href="#kitchen" onClick={(e) => { e.preventDefault(); scrollToSection('kitchen'); }}>4. ノンボレーゾーン（キッチン）</a></li>
              <li><a href="#faults" onClick={(e) => { e.preventDefault(); scrollToSection('faults'); }}>5. フォルト（反則）</a></li>
            </ul>
          </nav>

          {/* Rules Sections */}
          <section id="basics" ref={sectionRefs.basics} className="rule-section">
            <h3>1. 基本</h3>
            <h4>ゲームの目的</h4>
            <p>ピックルボールはテニス、バドミントン、卓球の要素を組み合わせたパドルスポーツです。ボールをネット越しに打ち、相手が合法的に返球できないようにすることが目的です。</p>
            <h4>コートのレイアウト</h4>
            <img src="/images/court-layout.png" alt="Pickleball Court Layout" className="img-fluid mb-3" />
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
            <p>サーブは必ずアンダーハンドで行います。腕を振り上げるように動かし、ボールに当たる瞬間、パドルのヘッドが手首より下にある必要があります。また、ボールとパドルの接触は腰より下で行われなければなりません。</p>
            <img src="/images/serve-motion.png" alt="Underhand Serve Motion" className="img-fluid mb-3" />
            <h4>サーブの順番（ダブルス）</h4>
            <p>各チームはサイドアウトする前に2回のサーブ権を持ちます。1人目のサーバーがフォルト（失敗）するまでサーブを続け、次に2人目のサーバーがフォルトするまでサーブを続けます。2人目のフォルトで「サイドアウト」となり、相手チームにサーブ権が移ります。ただし、ゲーム開始時の最初のサーブについては、1人目のサーバーがフォルトした時点でサイドアウトになります。</p>
                        <h4>サーブを入れる場所</h4>
                        <p>サーブは対角線上の相手サービスコート内に着地し、ノンボレーゾーン（キッチン）を越える必要があります。サーブがキッチン内に着地した場合はフォルトです。ネットに触れてから正しいサービスコートに入った場合、プレーは続行されます。</p>
                        <h4>サーブ後のツーバウンドルール</h4>
                        <p>サーブされたボールは、レシーバーが打ち返す前に一度バウンドしなければなりません。そして、その返球もサーバーサイドで一度バウンドしてからでなければ、打ち返すことはできません。この2回のバウンドの後は、ボレー（ノーバウンドでの返球）が許可されます。</p>
                      </section>



          <section id="kitchen" ref={sectionRefs.kitchen} className="rule-section">
            <h3>4. ノンボレーゾーン（キッチン）</h3>
            <h4>キッチンとは？</h4>
            <p>ネットの両側にある7フィートのエリアです。</p>
            <h4>キッチンでのルール</h4>
            <p>プレイヤーは、ノンボレーゾーン内に立っている間、またはボレー後に勢いでゾーン内に入った場合、ボールをボレー（空中で打つ）することはできません。ただし、ボールがゾーン内でバウンドした場合は、キッチンに入って打つことができます。</p>
          </section>

          <section id="faults" ref={sectionRefs.faults} className="rule-section">
            <h3>5. フォルト（反則）</h3>
            <h4>主なフォルト</h4>
            <p>ルール違反があった場合、フォルトとなり、ラリーを失います。主なフォルトには、ボールがアウトオブバウンズになる、ネットを越えない、などがあります。（ラリー中にボールがネットに触れて相手コートに入るのは有効です。）</p>
            <h4>ノンボレーゾーンでのフォルト</h4>
            <p>キッチン内でボレーしたり、ボレー後に勢いでキッチンに足を踏み入れたりした場合。</p>
            <h4>サーブでのフォルト</h4>
            <p>サーブがアウトオブバウンズ、ネットイン、または正しいサービスコート内に着地しなかった場合。</p>
          </section>
        </div>
      </Modal.Body>

    </Modal>
  );
};

export default RulesModal;
