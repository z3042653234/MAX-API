import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Layout } from '@douyinfe/semi-ui';

const About = () => {
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;
      if (!data.startsWith('https://')) {
        aboutContent = marked.parse(data);
      }
      setAbout(aboutContent);
      localStorage.setItem('about', aboutContent);
    } else {
      showError(message);
      setAbout('加载关于内容失败...');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  return (
    <>
      {aboutLoaded && about === '' ? (
        <>
          <main className="semi-layout-content">
            <header className="semi-layout-header">
              <div style={{ textAlign: 'center' }}>
                 <h2 style={{ color: '#6262a0' }}>活动福利</h2>
              </div>
            </header>
            <div className="semi-empty semi-empty-vertical">
              <div className="semi-empty-image" x-semi-prop="image,darkModeImage">
                <img src="/libao.png" alt="Libao" style={{ width: '35%', height: '35%' }} />
              </div>
              <div className="semi-empty-content">
                <h4 className="semi-typography semi-empty-title semi-typography-primary semi-typography-normal semi-typography-h4" x-semi-prop="title">正在策划中</h4>
                <div className="semi-empty-description" x-semi-prop="description">敬请期待~</div>
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          {about.startsWith('https://') ? (
            <iframe
              src={about}
              style={{ width: '100%', height: '100vh', border: 'none' }}
            />
          ) : (
            <div
              style={{ fontSize: 'larger' }}
              dangerouslySetInnerHTML={{ __html: about }}
            ></div>
          )}
        </>
      )}
    </>
  );
};

export default About;
